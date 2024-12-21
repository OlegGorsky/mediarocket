import React, { useState } from 'react';
import { Folder, ChevronRight, CheckCircle2, Rocket } from 'lucide-react';
import { ChannelModal } from '../components/ChannelModal';
import { ExpertsModal } from '../components/ExpertsModal';
import { useStore } from '../store/useStore';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const channels = [
  {
    id: 'channel1',
    title: 'Олег Горский',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/oleggorsky',
  },
  {
    id: 'channel2',
    title: 'Михаил Дюжаков',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/duzhakov',
  },
  {
    id: 'channel3',
    title: 'Медиаракета',
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?auto=format&fit=crop&q=80&w=200',
    link: 'https://t.me/mediarocket',
  },
];

export const TasksPage: React.FC = () => {
  const { setPromoModalOpen } = useStore();
  const { tg, user } = useTelegram();
  const [selectedChannel, setSelectedChannel] = useState<typeof channels[0] | null>(null);
  const [isExpertsModalOpen, setExpertsModalOpen] = useState(false);

  const { data: subscriptions = {} } = useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async () => {
      const results = await Promise.all(
        channels.map(async (channel) => {
          const subscriptionStatus = await api.checkSubscription(user?.id || 0, channel.id);
          
          switch (subscriptionStatus) {
            case 'yes':
              toast.success(`Вы подписаны на ${channel.title}. Вам начислено 500 RC!`);
              break;
            case 'no':
              toast.error(`Вы не подписаны на ${channel.title}. Подпишитесь, чтобы получить 500 RC.`);
              break;
            case 'unscribe':
              toast.error(`Вы отписались от ${channel.title}, но уже получили 500 RC.`);
              break;
            case 'again':
              toast.error(`Вы уже получили 500 RC за подписку на ${channel.title}.`);
              break;
            default:
              toast.error('Неизвестный статус подписки.');
          }

          return [channel.id, subscriptionStatus === 'yes'];
        })
      );
      return Object.fromEntries(results);
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const handleAddFolder = () => {
    tg.openTelegramLink('https://t.me/addlist/5GQ_k87wW4xjZjYy');
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex flex-col items-center mb-4">
        <Rocket size={28} className="text-[#6C3CE1] mb-2" />
        <h1 className="text-lg font-bold text-white text-center">
          Выполняй задания и получай RocketCoin!
        </h1>
      </div>

      <div className="bg-[#1F1B2E] rounded-lg p-3 mb-3">
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
        onClick={() => setPromoModalOpen(true)}
        className="w-full bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium mb-3 text-sm"
      >
        Ввести код
      </button>

      <button
        onClick={handleAddFolder}
        className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2.5 rounded-lg font-medium flex items-center justify-between px-3 text-sm transition-colors mb-3"
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

      <ChannelModal
        isOpen={!!selectedChannel}
        onClose={() => setSelectedChannel(null)}
        channel={selectedChannel}
      />
      
      <ExpertsModal
        isOpen={isExpertsModalOpen}
        onClose={() => setExpertsModalOpen(false)}
      />
    </div>
  );
};
