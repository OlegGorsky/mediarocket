import { apiClient, WEBHOOKS } from './api/config';

export const referralService = {
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
  }
};