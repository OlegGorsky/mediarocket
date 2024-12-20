import { apiClient, WEBHOOKS } from './api/config';
import type { User } from '../types';

export interface InitialBonusResponse {
  status: 'ok' | 'already_claimed' | 'error';
  message?: string;
}

export const userService = {
  async getUserPoints(userId: number, username: string, firstName: string, photoUrl?: string): Promise<number> {
    try {
      const response = await apiClient.post(WEBHOOKS.GET_BALANCE, {
        user_id: userId,
        username,
        first_name: firstName,
        photo_url: photoUrl
      });
      return response.data.points || 0;
    } catch (error) {
      console.error('Error getting user points:', error);
      return 0;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      console.log('Fetching all users...'); // Debug log
      const response = await apiClient.post(WEBHOOKS.GET_ALL_USERS);
      console.log('Response:', response.data); // Debug log
      return response.data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async claimInitialBonus(userId: number): Promise<InitialBonusResponse> {
    try {
      const response = await apiClient.post(WEBHOOKS.CLAIM_INITIAL_BONUS, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error claiming initial bonus:', error);
      return { status: 'error', message: 'Failed to claim bonus' };
    }
  }
};