import { apiClient, WEBHOOKS } from './config';

interface SubscriptionResponse {
  subscribe: string;
}

export const subscriptionService = {
  async checkSubscription(userId: number, channelUsername: string): Promise<string> {
    try {
      const response = await apiClient.post<SubscriptionResponse>(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: channelUsername
      });

      console.log('API Response:', response.data); // Логирование ответа

      if (response.data && typeof response.data.subscribe === 'string') {
        return response.data.subscribe;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      throw error;
    }
  }
};
