import React, { useState } from 'react';
import { Users2, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import expertsData from '../data/experts.json';
import type { Expert } from '../types';
import axios from 'axios';
import toast from 'react-hot-toast';

// Интерфейс для ответа API
interface SubscriptionResponse {
  subscribe: string;
}

// Конфигурация API-клиента
const apiClient = axios.create({
  baseURL: 'https://gorskybase.store',
  headers: {
    'Content-Type': 'application/json',
  },
});

// URL вебхука
const WEBHOOKS = {
  CHECK_SUBSCRIPTION: '/webhook/d2aaceca-d12a-4d22-a30b-907c0f6f097c',
};

// Сервис для проверки подписки
const telegramService = {
  async checkChannelSubscription(userId: number, channelUsername: string): Promise<SubscriptionResponse> {
    try {
      const response = await apiClient.post<SubscriptionResponse[]>(WEBHOOKS.CHECK_SUBSCRIPTION, {
        user_id: userId,
        channel_username: channelUsername,
      });

      console.log('Full API Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      throw error;
    }
  }
};

// Обработчик ответа API
export const handleApiResponse = (response: SubscriptionResponse[]): void => {
  console.log('Full API Response:', response);

  if (!Array.isArray(response) || response.length === 0) {
    toast.error('Некорректный ответ от сервера');
    return;
  }

  const subscriptionStatus = response[0].subscribe;

  switch (subscriptionStatus) {
    case 'yes':
      toast.success('Отлично! Видим подписку. Вам начислено 100 РокетКоинов!');
      break;
    case 'no':
      toast.error('К сожалению, не видим вашей подписки. Сначала подпишитесь, чтоб получить 100 РокетКоинов.');
      break;
    case 'unscribe':
      toast.error('Вы уже получили 100 РокетКоинов, но почему-то отписались от ТГ-канала.');
      break;
    case 'again':
      toast.error('Вы уже получили 100 РокетКоинов за подписку на этот ТГ-канал!');
      break;
    case 'unknown':
      toast.error('Статус подписки неизвестен. Пожалуйста, попробуйте позже.');
      break;
    default:
      toast.error('Неизвестный статус подписки.');
  }
};

export const ExpertsPage: React.FC = () => {
  const { user } = useTelegram();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  const handleSubscriptionCheck = async (expert: Expert) => {
    if (!user?.id) return;

    try {
      const channelUsername = expert.link.split('/').pop() || '';
      const response = await telegramService.checkChannelSubscription(user.id, channelUsername);
      handleApiResponse(response);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  return (
    <div className="p-4 pb-36 bg-[#160c30] min-h-screen">
      <div className="flex flex-col items-center mb-4">
        <Users2 size={28} className="text-[#6C3CE1] mb-2" />
        <h1 className="text-lg font-bold text-white text-center">
          Эксперты Медиаракеты!
        </h1>
      </div>

      <div className="space-y-2">
        {expertsData.experts.map((expert) => (
          <button
            key={expert.id}
            onClick={() => setSelectedExpert(expert)}
            className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2 rounded-lg font-medium flex items-center justify-between px-3 transition-colors shadow-md"
          >
            <div className="flex items-center gap-2">
              <img
                src={expert.image}
                alt={expert.title}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="text-sm flex items-center gap-2">
                  {expert.title}
                  {expert.featured && (
                    <span className="text-xs bg-[#6C3CE1] px-2 py-0.5 rounded-full">
                      Топ
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {subscriptions[expert.id] ? '+50 RC' : 'Подписаться'}
                </div>
              </div>
            </div>
            {subscriptions[expert.id] ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>
        ))}
      </div>

      {selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-[#1F1B2E] p-4 rounded-t-lg shadow-lg max-w-md w-full text-white relative">
            <button
              onClick={() => setSelectedExpert(null)}
              className="absolute top-2 right-2 text-white"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center mb-6 mt-4">
              <img
                src={selectedExpert.image}
                alt={selectedExpert.title}
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
              <h2 className="text-lg font-bold">{selectedExpert.title}</h2>
              <p className="text-center">{selectedExpert.description}</p>
            </div>
            <button
              onClick={() => window.open(selectedExpert.link, '_blank')}
              className="bg-[#6C3CE1] text-white py-2 px-4 rounded w-full mb-2"
            >
              ТГ-канал эксперта
            </button>
            <button
              onClick={() => handleSubscriptionCheck(selectedExpert)}
              className="bg-[#5A2FB0] text-white py-2 px-4 rounded w-full mb-2"
            >
              Проверить подписку
            </button>
            <button
              onClick={() => window.open(selectedExpert.benefitLink, '_blank')}
              className="bg-[#4A238F] text-white py-2 px-4 rounded w-full mb-8"
            >
              Польза от эксперта
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
