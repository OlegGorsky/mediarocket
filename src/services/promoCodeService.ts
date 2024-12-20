import { apiClient, WEBHOOKS } from './api/config';
import toast from 'react-hot-toast';

export const promoCodeService = {
  async claimKeyword(userId: number, keyword: string) {
    try {
      const response = await apiClient.post(WEBHOOKS.CHECK_PROMO_CODE, {
        user_id: userId,
        keyword: keyword.toLowerCase()
      });
      
      if (response.data.status === 'success') {
        toast.success('Промокод успешно применен!');
        return response.data;
      } else {
        toast.error(response.data.reason || 'Промокод уже использован или недействителен');
        return response.data;
      }
    } catch (error) {
      console.error('Error claiming keyword:', error);
      toast.error('Ошибка при применении промокода');
      throw error;
    }
  }
};