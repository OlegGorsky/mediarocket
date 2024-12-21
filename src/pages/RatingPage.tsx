import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { userService } from '../services/userService';
import { useTelegram } from '../hooks/useTelegram';
import { useStore } from '../store/useStore';
import { RatingCard } from '../components/RatingCard';
import type { User } from '../types';

export const RatingPage: React.FC = () => {
  const { user: currentUser } = useTelegram();
  const { currentTab } = useStore();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', currentTab],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      console.log('API Response:', response); // Debug log
      return response || [];
    },
    enabled: !!currentUser?.id,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  const sortedUsers = React.useMemo(() => {
    return users.sort((a, b) => parseInt(b.points) - parseInt(a.points));
  }, [users]);

  if (isLoading) {
    return (
      <div className="p-4 pb-24 text-white">
        <div className="flex flex-col items-center mb-6">
          <Trophy size={32} className="text-[#6C3CE1] mb-3" />
          <h1 className="text-xl font-bold text-center">
            Участники нашего розыгрыша
          </h1>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C3CE1]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex flex-col items-center mb-6">
        <Trophy size={32} className="text-[#6C3CE1] mb-3" />
        <h1 className="text-xl font-bold text-white text-center">
          Участники нашего розыгрыша
        </h1>
      </div>
      <div className="space-y-3">
        {sortedUsers.map((user, index) => (
          <RatingCard
            key={user.id}
            user={user}
            index={index}
            isCurrentUser={user.userid === currentUser?.id.toString()}
          />
        ))}
        {sortedUsers.length === 0 && (
          <div className="text-gray-400 text-center py-8">
            Пока нет участников
          </div>
        )}
      </div>
    </div>
  );
};
