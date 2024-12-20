import { apiClient, WEBHOOKS } from './config';

export const subscriptionService = {
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
  }
};