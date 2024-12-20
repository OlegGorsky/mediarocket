import React from 'react';
import { Rocket, Users, Zap, Users2, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tab } from '../types';
import { clsx } from 'clsx';

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'rocket', icon: <Rocket size={24} />, label: 'Главная' },
  { id: 'friends', icon: <Users size={24} />, label: 'Друзья' },
  { id: 'tasks', icon: <Zap size={24} />, label: 'Задания' },
  { id: 'experts', icon: <Users2 size={24} />, label: 'Эксперты' },
  { id: 'rating', icon: <Trophy size={24} />, label: 'Рейтинг' }
];

export const Navigation: React.FC = () => {
  const { currentTab, setCurrentTab } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0b0c17] backdrop-blur-md text-white border-t border-white/5">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              currentTab === tab.id ? 'text-[#6C3CE1]' : 'text-gray-400'
            )}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};