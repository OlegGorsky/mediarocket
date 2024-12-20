import { apiClient, WEBHOOKS } from './api/config';

export const expertService = {
  async checkExpertSubscription(userId: number, expertUsername: string): Promise<boolean> {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: expertUsername
      });
      return response.data.is_subscribed || false;
    } catch (error) {
      console.error('Error checking expert subscription:', error);
      return false;
    }
  }
};