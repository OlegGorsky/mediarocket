import React, { useState } from 'react';
import { Folder, ChevronRight, CheckCircle2, Rocket, Users2, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

const channels = [
  {
    id: 'gorskytalk',
    title: 'Олег Горский',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/gorskytalk',
    description: 'Эксперт по digital-маркетингу и монетизации Telegram-каналов',
    benefitLink: 'https://t.me/gorskytalk/100'
  },
  {
    id: 'mikeorda',
    title: 'Михаил Дюжаков',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/mikeorda',
    description: 'Специалист по масштабированию бизнеса и личному бренду',
    benefitLink: 'https://t.me/mikeorda/100'
  },
  {
    id: 'mediaraketa',
    title: 'Медиаракета',
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/mediaraketa',
    description: 'Официальный канал проекта Медиаракета',
    benefitLink: 'https://t.me/mediaraketa/100'
  }
];

const sendToWebhook = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    console.log('Данные успешно отправлены на вебхук:', response.data);
  } catch (error) {
    console.error('Ошибка при отправке данных на вебхук:', error.response?.data || error.message);
    toast.error('Ошибка при отправке данных на вебхук');
  }
};

const handleApiResponse = (response) => {
  console.log('Full API Response:', response);

  if (!Array.isArray(response) || response.length === 0) {
    toast.error('Некорректный ответ от сервера');
    return false;
  }

  const subscriptionStatus = response[0]?.subscribe;

  if (!subscriptionStatus) {
    toast.error('Ответ не содержит статус подписки');
    return false;
  }

  switch (subscriptionStatus) {
    case 'yes':
      toast.success('Отлично! Видим подписку. Вам начислено 100 РокетКоинов!');
      return true;
    case 'no':
      toast.error('К сожалению, не видим вашей подписки. Сначала подпишитесь, чтоб получить 100 РокетКоинов.');
      return false;
    case 'unscribe':
      toast.error('Вы уже получили 100 РокетКоинов, но почему-то отписались от ТГ-канала.');
      return false;
    case 'again':
      toast.error('Вы уже получили 100 РокетКоинов за подписку на этот ТГ-канал!');
      return false;
    case 'unknown':
      toast.error('Статус подписки неизвестен. Пожалуйста, попробуйте позже.');
      return false;
    default:
      toast.error('Неизвестный статус подписки.');
      return false;
  }
};

const ExpertPanel = ({ expert, isOpen, onClose, onSubscriptionCheck }) => {
  const { user, tg } = useTelegram();

  const handleSubscriptionCheck = async () => {
    if (!user?.id) {
      toast.error('Ошибка проверки подписки');
      return;
    }

    try {
      const channelUsername = expert.link.split('/').pop() || '';
      const response = await api.checkSubscription(user.id, channelUsername);
      handleApiResponse(response, onSubscriptionCheck);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error('Произошла ошибка при проверке подписки');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-[#160c30] rounded-t-2xl w-full p-6 relative pb-12">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <img
            src={expert.image}
            alt={expert.title}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h3 className="text-xl font-bold text-white mb-2">{expert.title}</h3>
          <p className="text-gray-400 text-sm mb-6">{expert.description}</p>
          
          <div className="space-y-3 w-full">
            <a
              href={expert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium text-center"
            >
              ТГ-канал эксперта
            </a>
            <button
              onClick={handleSubscriptionCheck}
              className="w-full bg-[#6C3CE1]/20 text-white py-2.5 rounded-lg font-medium"
            >
              Проверить подписку
            </button>
            <a
              href={expert.benefitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#6C3CE1]/20 text-white py-2.5 rounded-lg font-medium text-center"
              onClick={() => tg.openTelegramLink(expert.benefitLink)}
            >
              Польза от эксперта
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TasksPage: React.FC = () => {
  const { setCurrentTab } = useStore();
  const { tg, user } = useTelegram();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  const handleSubscriptionCheck = async (channel) => {
    if (!user?.id) return;

    const channelUsername = channel.link.split('/').pop() || '';
    try {
      const response = await api.checkSubscription(user.id, channelUsername);
      const isSubscribed = handleApiResponse(response);

      console.log('Subscription check result:', isSubscribed);

      setSubscriptions(prev => ({
        ...prev,
        [channel.id]: isSubscribed
      }));

      sendToWebhook('https://gorskybase.store/webhook/d2aaceca-d12a-4d22-a30b-907c0f6f097c', {
        userId: user.id,
        channelId: channel.id,
        isSubscribed
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error('Ошибка проверки подписки');
    }
  };

  const handleAddFolder = () => {
    tg.openTelegramLink('https://t.me/addlist/5GQ_k87wW4xjZjYy');
  };

  const handleSubmitPromo = async () => {
    if (!user?.id || !promoCode.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await api.claimKeyword(user.id, promoCode.trim());
      console.log('Promo code result:', result);

      if (result.status === 'success') {
        toast.success('Промокод успешно применен!');
        setPromoCode('');
        sendToWebhook('https://gorskybase.store/webhook/8ce88456-7ad5-4ea4-9b65-d187c07a4c63', {
          userId: user.id,
          promoCode,
          status: 'success'
        });
      } else {
        toast.error(result.reason || 'Промокод уже использован или недействителен');
        sendToWebhook('https://gorskybase.store/webhook/8ce88456-7ad5-4ea4-9b65-d187c07a4c63', {
          userId: user.id,
          promoCode,
          status: 'failed',
          reason: result.reason
        });
      }
    } catch (error) {
      console.error('Error submitting promo code:', error);
      toast.error('Ошибка при применении промокода');
      sendToWebhook('https://gorskybase.store/webhook/8ce88456-7ad5-4ea4-9b65-d187c07a4c63', {
        userId: user.id,
        promoCode,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 bg-[#160c30] min-h-screen">
      <div className="flex flex-col items-center mb-4">
        <Rocket size={28} className="text-[#6C3CE1] mb-2" />
        <h1 className="text-lg font-bold text-white text-center">
          Выполняй задания и получай RocketCoin!
        </h1>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Введите код здесь"
          className="w-full bg-[#1F1B2E] text-white py-3 px-4 rounded-lg pr-16 focus:outline-none focus:ring-2 focus:ring-[#6C3CE1] placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmitPromo}
          disabled={isLoading || !promoCode.trim()}
          className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-gradient-to-r from-[#6C3CE1] to-[#8B5CF6] rounded-r-lg disabled:opacity-50"
        >
          <Rocket size={24} className="text-white" />
        </button>
      </div>

      <div className="bg-[#1F1B2E] rounded-lg p-3 mb-6">
        <h2 className="text-sm font-medium text-white/80 mb-3 text-center">
          Подпишись на Телеграм-каналы организаторов и канал нашего розыгрыша
        </h2>
        <div className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2 rounded-lg font-medium flex items-center justify-between px-3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <img
                  src={channel.image}
                  alt={channel.title}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="text-sm">{channel.title}</div>
                  <div className="text-xs text-gray-400">
                    {subscriptions[channel.id] ? '+500 RC' : 'Подписаться'}
                  </div>
                </div>
              </div>
              {subscriptions[channel.id] ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddFolder}
        className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2.5 rounded-lg font-medium flex items-center justify-between px-3 text-sm transition-colors mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <Folder size={16} />
          </div>
          <div className="text-left">
            <div>Добавь папку</div>
            <div className="text-xs text-gray-400">
              Подпишись на все каналы из папки
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      <button
        onClick={() => setCurrentTab('experts')}
        className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2.5 rounded-lg font-medium flex items-center justify-between px-3 text-sm transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="bg-[#6C3CE1] p-1.5 rounded-lg">
            <Users2 size={16} />
          </div>
          <div className="text-left">
            <div>Смотреть экспертов</div>
            <div className="text-xs text-gray-400">
              Изучи материалы наших спикеров
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      {selectedChannel && (
        <ExpertPanel
          expert={selectedChannel}
          isOpen={!!selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onSubscriptionCheck={() => handleSubscriptionCheck(selectedChannel)}
        />
      )}
    </div>
  );
};
