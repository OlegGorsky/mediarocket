import React from 'react';
import { UserProfile } from '../components/UserProfile';
import { Onboarding } from '../components/Onboarding';
import { Carousel } from '../components/Carousel';
import { useStore } from '../store/useStore';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

export const RocketPage: React.FC = () => {
  const { setCurrentTab, setPromoModalOpen } = useStore();
  const { user } = useTelegram();

  const { data: bonusResponse, refetch: refetchBonus } = useQuery({
    queryKey: ['initialBonus', user?.id],
    queryFn: () => userService.claimInitialBonus(user?.id || 0),
    enabled: false, // Don't run automatically
  });

  const handleGetBonus = async () => {
    if (!user?.id) return;

    try {
      const result = await refetchBonus();
      const response = result.data;
      
      if (response?.status === 'ok') {
        toast.success('Вам начислено 100 RocketCoin!');
      } else if (response?.status === 'already_claimed') {
        toast.error('Вам уже начислены баллы');
      } else {
        toast.error('Произошла ошибка при начислении бонуса');
      }
    } catch (error) {
      toast.error('Произошла ошибка при начислении бонуса');
    }
  };

  return (
    <div className="p-4 pb-24">
      <UserProfile />
      <Onboarding />
      <div className="flex flex-col gap-4 mt-8">
        <button
          onClick={handleGetBonus}
          disabled={bonusResponse?.status === 'already_claimed'}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            bonusResponse?.status === 'already_claimed'
              ? 'bg-green-500/80 text-white cursor-not-allowed'
              : 'bg-[#6C3CE1] text-white hover:bg-[#5B32C1]'
          }`}
        >
          {bonusResponse?.status === 'already_claimed'
            ? 'Вам уже начислены баллы'
            : 'Получить 100 RocketCoin!'}
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentTab('tasks')}
            className="flex-1 bg-[#6C3CE1]/20 text-white py-3 rounded-lg font-medium border-2 border-[#6C3CE1] transition-colors hover:bg-[#6C3CE1]/30"
          >
            Задания
          </button>
          <button
            onClick={() => setPromoModalOpen(true)}
            className="flex-1 bg-[#6C3CE1]/20 text-white py-3 rounded-lg font-medium border-2 border-[#6C3CE1] transition-colors hover:bg-[#6C3CE1]/30"
          >
            Ввести код
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Carousel />
      </div>
    </div>
  );
};