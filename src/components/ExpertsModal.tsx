import React, { useState } from 'react';
import { X, Users2, ArrowRight } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { experts } from '../data/experts';
import toast from 'react-hot-toast';

interface ExpertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertsModal: React.FC<ExpertsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useTelegram();
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const currentExpert = experts[currentExpertIndex];

  const handleNext = () => {
    if (currentExpertIndex < experts.length - 1) {
      setCurrentExpertIndex(prev => prev + 1);
      toast.success('Следующий эксперт');
    }
  };

  if (!isOpen || !currentExpert) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#160c30] rounded-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#6C3CE1]/20 p-3 rounded-full mb-4">
            <Users2 size={24} className="text-[#6C3CE1]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Изучай материалы экспертов
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Эксперт {currentExpertIndex + 1} из {experts.length}
          </p>

          <div className="w-full space-y-4">
            <img
              src={currentExpert.avatar}
              alt={currentExpert.name}
              className="w-20 h-20 rounded-full mx-auto object-cover"
            />
            <h4 className="text-lg font-bold text-white">{currentExpert.name}</h4>
            <p className="text-sm text-gray-400">{currentExpert.description}</p>
            
            <div className="space-y-3">
              <a
                href={currentExpert.channelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#6C3CE1] text-white py-2.5 rounded-lg font-medium text-sm text-center"
              >
                Перейти в канал
              </a>
              <a
                href={currentExpert.leadMagnetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#6C3CE1]/20 text-white py-2.5 rounded-lg font-medium text-sm text-center"
              >
                Получить материалы
              </a>
              <button
                onClick={handleNext}
                disabled={currentExpertIndex === experts.length - 1}
                className="w-full bg-[#6C3CE1]/20 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Следующий эксперт <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};