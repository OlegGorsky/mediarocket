import React from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { RocketCoin } from './RocketCoin';
import { Rocket } from 'lucide-react';
import { useStore } from '../store/useStore';

export const UserProfile: React.FC = () => {
  const { user } = useTelegram();
  const { currentTab } = useStore();

  const { data: points = 0 } = useQuery({
    queryKey: ['userPoints', user?.id, currentTab],
    queryFn: () => userService.getUserPoints(
      user?.id || 0,
      user?.username || '',
      user?.first_name || '',
      user?.photo_url
    ),
    enabled: !!user?.id,
    staleTime: 0, // Always refetch when tab changes
    cacheTime: 0, // Don't cache the result
  });

  return (
    <div className="flex items-center gap-4 mb-6 text-white">
      <div className="flex items-center gap-4">
        {user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.first_name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#6C3CE1]/20 flex items-center justify-center">
            <Rocket size={24} className="text-[#6C3CE1]" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            Привет, {user?.first_name || 'Гость'}!
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <RocketCoin />
            <span className="text-lg font-medium">{points}</span>
          </div>
        </div>
      </div>
    </div>
  );
};