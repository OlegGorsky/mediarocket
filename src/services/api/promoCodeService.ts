import { apiClient, WEBHOOKS } from './config';

export const promoCodeService = {
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