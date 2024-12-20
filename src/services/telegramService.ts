import { apiClient, WEBHOOKS } from './api/config';

export const telegramService = {
  async checkChannelSubscription(userId: number, channelUsername: string): Promise<boolean> {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: channelUsername.replace('@', '')
      });
      return response.data.is_subscribed || false;
    } catch (error) {
      console.error('Error checking channel subscription:', error);
      return false;
    }
  }
};