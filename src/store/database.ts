import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface DatabaseState {
  users: Record<number, User & { 
    initialBonusReceived?: boolean;
    channelRewards?: string[];
  }>;
  subscriptions: Record<number, string[]>;
  expertViews: Record<number, { date: string; experts: string[] }>;
  addUser: (user: User) => void;
  updateUserPoints: (userId: number, points: number) => void;
  addSubscription: (userId: number, channelId: string) => void;
  checkSubscription: (userId: number, channelId: string) => boolean;
  hasChannelReward: (userId: number, channelId: string) => boolean;
  markChannelRewarded: (userId: number, channelId: string) => void;
  addExpertView: (userId: number, expertId: string) => boolean;
  getExpertViewsToday: (userId: number) => number;
  getAllUsers: () => User[];
  getReferrals: (userId: number) => User[];
  hasReceivedInitialBonus: (userId: number) => boolean;
  markInitialBonusReceived: (userId: number) => void;
}

export const useDatabase = create<DatabaseState>()(
  persist(
    (set, get) => ({
      users: {},
      subscriptions: {},
      expertViews: {},

      addUser: (user) =>
        set((state) => ({
          users: { ...state.users, [user.id]: user },
        })),

      updateUserPoints: (userId, points) =>
        set((state) => ({
          users: {
            ...state.users,
            [userId]: {
              ...state.users[userId],
              points: (state.users[userId]?.points || 0) + points,
            },
          },
        })),

      addSubscription: (userId, channelId) =>
        set((state) => ({
          subscriptions: {
            ...state.subscriptions,
            [userId]: [...(state.subscriptions[userId] || []), channelId],
          },
        })),

      checkSubscription: (userId, channelId) => {
        const state = get();
        return state.subscriptions[userId]?.includes(channelId) || false;
      },

      hasChannelReward: (userId, channelId) => {
        const state = get();
        return state.users[userId]?.channelRewards?.includes(channelId) || false;
      },

      markChannelRewarded: (userId, channelId) =>
        set((state) => ({
          users: {
            ...state.users,
            [userId]: {
              ...state.users[userId],
              channelRewards: [
                ...(state.users[userId]?.channelRewards || []),
                channelId,
              ],
            },
          },
        })),

      addExpertView: (userId, expertId) => {
        const today = new Date().toISOString().split('T')[0];
        const currentViews = get().expertViews[userId];
        
        if (currentViews?.date === today && currentViews.experts.length >= 5) {
          return false;
        }

        set((state) => ({
          expertViews: {
            ...state.expertViews,
            [userId]: {
              date: today,
              experts: [
                ...(state.expertViews[userId]?.date === today
                  ? state.expertViews[userId].experts
                  : []),
                expertId,
              ],
            },
          },
        }));
        return true;
      },

      getExpertViewsToday: (userId) => {
        const today = new Date().toISOString().split('T')[0];
        const views = get().expertViews[userId];
        return views?.date === today ? views.experts.length : 0;
      },

      getAllUsers: () => {
        const state = get();
        return Object.values(state.users).sort((a, b) => b.points - a.points);
      },

      getReferrals: (userId) => {
        const state = get();
        return Object.values(state.users).filter(
          (user) => user.referrer === userId
        );
      },

      hasReceivedInitialBonus: (userId) => {
        return !!get().users[userId]?.initialBonusReceived;
      },

      markInitialBonusReceived: (userId) => {
        set((state) => ({
          users: {
            ...state.users,
            [userId]: {
              ...state.users[userId],
              initialBonusReceived: true,
            },
          },
        }));
      },
    }),
    {
      name: 'telegram-webapp-storage',
    }
  )
);