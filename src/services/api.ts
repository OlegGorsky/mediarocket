import { apiClient, WEBHOOKS } from './api/config';
import type { User } from '../types';

export const api = {
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
      const response = await apiClient.post(WEBHOOKS.GET_ALL_USERS);
      return response.data.users || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  async claimInitialBonus(userId: number) {
    try {
      const response = await apiClient.post(WEBHOOKS.CLAIM_INITIAL_BONUS, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error claiming initial bonus:', error);
      throw error;
    }
  },

  async checkSubscription(userId: number, channelUsername: string): Promise<boolean> {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: channelUsername
      });
      return response.data.is_subscribed || false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  },

  async processReferral(referrerId: number, userId: number) {
    try {
      const response = await apiClient.post(WEBHOOKS.PROCESS_REFERRAL, {
        referrer_id: referrerId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error processing referral:', error);
      return { status: 'fail' };
    }
  },

  async getReferrals(userId: number) {
    try {
      const response = await apiClient.post(WEBHOOKS.GET_REFERRALS, {
        user_id: userId
      });
      return response.data.referrals || [];
    } catch (error) {
      console.error('Error getting referrals:', error);
      return [];
    }
  },

  async claimKeyword(userId: number, keyword: string) {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_PROMO_CODE, {
        user_id: userId,
        keyword: keyword.toLowerCase()
      });
      return response.data;
    } catch (error) {
      console.error('Error claiming keyword:', error);
      throw error;
    }
  }
};