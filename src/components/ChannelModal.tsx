import React from 'react';
import { X } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: {
    id: string;
    title: string;
    image: string;
    link: string;
  } | null;
}

export const ChannelModal: React.FC<ChannelModalProps> = ({
  isOpen,
  onClose,
  channel,
}) => {
  const { user } = useTelegram();

  const handleSubscriptionCheck = async () => {
    if (!user?.id || !channel) {
      toast.error('Ошибка проверки подписки');
      return;
    }

    try {
      const wasSubscribed = await api.checkSubscription(user.id, channel.id);
      
      if (wasSubscribed) {
        const rewardResult = await api.rewardChannelSubscription(user.id, channel.id);
        if (rewardResult.alreadyRewarded) {
          toast.success('Вам уже начислено 500 баллов за подписку!');
        } else if (rewardResult.rewarded) {
          toast.success('Отлично! Видим твою подписку, тебе начислено 500 баллов!');
        }
      } else {
        toast.error('Сначала подпишись на этот Телеграм-канал!');
      }
    } catch (error) {
      toast.error('Произошла ошибка при проверке подписки');
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#160c30] rounded-2xl w-full max-w-sm mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center gap-4">
          <img
            src={channel.image}
            alt={channel.title}
            className="w-20 h-20 rounded-full object-cover"
          />
          <h3 className="text-xl font-bold text-white">{channel.title}</h3>
          <a
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium text-center"
          >
            Перейти в канал
          </a>
          <button
            onClick={handleSubscriptionCheck}
            className="w-full bg-[#6C3CE1]/20 text-white py-2.5 rounded-lg font-medium"
          >
            Проверить подписку
          </button>
        </div>
      </div>
    </div>
  );
};