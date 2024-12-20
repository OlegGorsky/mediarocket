import { apiClient, WEBHOOKS } from './config';
import type { User } from '../../types';

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
  }
};