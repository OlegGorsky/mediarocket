import React from 'react';
import { X } from 'lucide-react';
import { Expert } from '../types';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface ExpertPanelProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionCheck: () => void;
}

export const ExpertPanel: React.FC<ExpertPanelProps> = ({
  expert,
  isOpen,
  onClose,
  onSubscriptionCheck
}) => {
  const { user, tg } = useTelegram();

  const handleSubscriptionCheck = async () => {
    if (!user?.id) {
      toast.error('Ошибка проверки подписки');
      return;
    }

    try {
      const channelUsername = expert.link.split('/').pop() || '';
      const subscriptionStatus = await api.checkSubscription(user.id, channelUsername);

      switch (subscriptionStatus) {
        case 'yes':
          toast.success('Отлично! Видим подписку. Вам начислено 100 РокетКоинов!');
          onSubscriptionCheck();
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
        default:
          toast.error('Неизвестный статус подписки.');
      }
    } catch (error) {
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
