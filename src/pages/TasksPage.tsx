import React, { useState } from 'react';
import { Folder, ChevronRight, CheckCircle2, Rocket, Users2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';
import { ExpertPanel } from '../components/ExpertPanel';
import toast from 'react-hot-toast';

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

export const TasksPage: React.FC = () => {
  const { setCurrentTab } = useStore();
  const { tg, user } = useTelegram();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  const handleSubscriptionCheck = async (channel: any) => {
    if (!user?.id) return;
    
    const channelUsername = channel.link.split('/').pop() || '';
    const isSubscribed = await api.checkSubscription(user.id, channelUsername);
    
    setSubscriptions(prev => ({
      ...prev,
      [channel.id]: isSubscribed
    }));
  };

  const handleAddFolder = () => {
    tg.openTelegramLink('https://t.me/addlist/5GQ_k87wW4xjZjYy');
  };

  const handleSubmitPromo = async () => {
    if (!user?.id || !promoCode.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await api.claimKeyword(user.id, promoCode.trim());
      if (result.status === 'success') {
        toast.success('Промокод успешно применен!');
        setPromoCode('');
      } else {
        toast.error(result.reason || 'Промокод уже использован или недействителен');
      }
    } catch (error) {
      console.error('Error submitting promo code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24">
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