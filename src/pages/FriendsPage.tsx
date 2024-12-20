import React from 'react';
import { Share, Copy, Users } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { User } from '../types';

export const FriendsPage: React.FC = () => {
  const { user, tg } = useTelegram();
  
  const { data: referrals = [] } = useQuery<User[]>({
    queryKey: ['referrals', user?.id],
    queryFn: () => api.getReferrals(user?.id || 0),
    enabled: !!user?.id,
    initialData: [],
  });

  const getReferralLink = () => {
    const base64UserId = btoa(user?.id?.toString() || '');
    return `https://t.me/gorskyAIbot/rocket?startapp=${base64UserId}`;
  };

  const handleShare = () => {
    const link = getReferralLink();
    const message = `Привет! Я участвую в розыгрыше от Медеаректы! ${link}`;
    try {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Не удалось поделиться');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReferralLink());
    toast.success('Ссылка скопирована');
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex flex-col items-center mb-6">
        <Users size={32} className="text-[#6C3CE1] mb-3" />
        <h1 className="text-lg font-bold text-white text-center px-4">
          Приглашай друзей в нашу игру и зарабатывай RocketCoin!
        </h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleShare}
          className="flex-1 bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
        >
          <Share size={16} /> Пригласить друзей
        </button>
        <button
          onClick={handleCopy}
          className="bg-[#6C3CE1] text-white p-2.5 rounded-lg"
        >
          <Copy size={16} />
        </button>
      </div>

      <div className="bg-[#1F1B2E] rounded-lg p-4">
        <h2 className="text-base font-medium text-white mb-4">
          Приглашенные друзья ({referrals.length})
        </h2>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center gap-3 text-white"
            >
              {referral.photo_url ? (
                <img
                  src={referral.photo_url}
                  alt={referral.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  {referral.name[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium">{referral.name}</div>
                <div className="text-sm text-gray-400">+50 RC</div>
              </div>
            </div>
          ))}
          {referrals.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              Пока нет приглашенных друзей
            </div>
          )}
        </div>
      </div>
    </div>
  );
};