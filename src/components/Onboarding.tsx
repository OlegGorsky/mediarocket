import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

const steps = [
  {
    title: 'Добро пожаловать!',
    description: 'Это проект, где сошлись твердые эксперты, сочные призы и активная аудитория',
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Выполняй задания',
    description: 'Выполняй простые задания и накапливай RocketCoin для получения призов',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Приглашай друзей',
    description: 'Приглашай друзей, чтобы увеличить свои шансы',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Изучай экспертов',
    description: 'Открывай для себя крутых экспертов и спецов по разным тематикам',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Начни зарабатывать',
    description: 'Переходи к заданиям, чтобы получить еще больше RocketCoin',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
  },
];

export const Onboarding: React.FC = () => {
  const { currentStep, setCurrentStep, setCurrentTab } = useStore();

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setCurrentTab('tasks');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="relative">
      <img
        src={currentStepData.image}
        alt={currentStepData.title}
        className="w-full h-28 object-cover rounded-lg mb-4"
      />
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold mb-2">{currentStepData.title}</h2>
        <p className="text-gray-400 text-sm">{currentStepData.description}</p>
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={clsx(
              'h-1 rounded-full flex-1 transition-colors',
              index === currentStep ? 'bg-[#6C3CE1]' : 'bg-gray-700'
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={clsx(
            'px-3 py-2 flex items-center gap-1 text-sm bg-[#6C3CE1]/20 rounded-lg',
            currentStep === 0 ? 'opacity-50' : ''
          )}
        >
          <ChevronLeft size={16} /> Назад
        </button>
        <button
          onClick={handleNext}
          className="px-3 py-2 flex items-center gap-1 bg-[#6C3CE1] text-white rounded-lg text-sm"
        >
          {currentStep === steps.length - 1 ? 'К заданиям' : 'Дальше'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};