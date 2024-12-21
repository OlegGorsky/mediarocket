import { apiClient, WEBHOOKS } from './api/config';

export const expertService = {
  async checkExpertSubscription(userId: number, expertUsername: string): Promise<string> {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: expertUsername
      });

      console.log('API Response:', response.data); // Логирование ответа

      if (Array.isArray(response.data)) {
        // Обработка случая, когда ответ является массивом
        return response.data[0]?.subscription_status || 'unknown';
      } else if (typeof response.data === 'object' && response.data !== null) {
        // Обработка случая, когда ответ является объектом
        return response.data.subscription_status || 'unknown';
      } else {
        console.error('Unexpected response format:', response.data);
        return 'unknown';
      }
    } catch (error) {
      console.error('Error checking expert subscription:', error);
      return 'error';
    }
  }
};
