import React, { useState } from 'react';
import { Users2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';
import { telegramService } from '../services/telegramService';
import { ExpertPanel } from '../components/ExpertPanel';
import expertsData from '../data/experts.json';
import type { Expert } from '../types';

export const ExpertsPage: React.FC = () => {
  const { user } = useTelegram();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  const handleSubscriptionCheck = async (expert: Expert) => {
    if (!user?.id) return;
    
    const channelUsername = expert.link.split('/').pop() || '';
    const isSubscribed = await telegramService.checkChannelSubscription(
      user.id,
      channelUsername
    );
    
    setSubscriptions(prev => ({
      ...prev,
      [expert.id]: isSubscribed
    }));
  };

  return (
    <div className="p-4 pb-24">
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
            className="w-full bg-[#1F1B2E] hover:bg-[#2A2640] text-white py-2 rounded-lg font-medium flex items-center justify-between px-3 transition-colors relative"
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

      <ExpertPanel
        expert={selectedExpert!}
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
        onSubscriptionCheck={() => selectedExpert && handleSubscriptionCheck(selectedExpert)}
      />
    </div>
  );
};