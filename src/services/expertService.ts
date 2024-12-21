import { apiClient, WEBHOOKS } from './api/config';

export const expertService = {
  async checkExpertSubscription(userId: number, expertUsername: string): Promise<string> {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: expertUsername
      });
      return response.data.subscription_status || 'unknown';
    } catch (error) {
      console.error('Error checking expert subscription:', error);
      return 'error';
    }
  }
};
