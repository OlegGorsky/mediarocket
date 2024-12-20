import axios from 'axios';

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      throw new Error('Сервис временно недоступен');
    } else if (error.response?.status === 500) {
      throw new Error('Произошла ошибка на сервере');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Ошибка сети - проверьте подключение');
    }
    return Promise.reject(error);
  }
);

export const WEBHOOKS = {
  GET_BALANCE: 'https://gorskybase.store/webhook/a6197f62-b112-4bc6-9a31-4b1cf502302e',
  CLAIM_INITIAL_BONUS: 'https://gorskybase.store/webhook/190ea09a-0fb7-4b2e-ab69-687a2674922b',
  GET_ALL_USERS: 'https://gorskybase.store/webhook/cef75604-1a4a-4516-b952-dc23166c61a0',
  CHECK_PROMO_CODE: 'https://gorskybase.store/webhook/8ce88456-7ad5-4ea4-9b65-d187c07a4c63',
  CHECK_SUBSCRIPTION: 'https://gorskybase.store/webhook/d2aaceca-d12a-4d22-a30b-907c0f6f097c',
  PROCESS_REFERRAL: 'https://gorskybase.store/webhook/dd9cf26a-8917-46da-a9a7-538ffbdf3e7d',
  GET_REFERRALS: 'https://gorskybase.store/webhook/b6e8222f-8c1b-461a-978f-e70e1f1e9c38'
};