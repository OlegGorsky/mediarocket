import React from 'react';
import { Rocket } from 'lucide-react';
import type { User } from '../types';

interface RatingCardProps {
  user: User;
  index: number;
  isCurrentUser: boolean;
}

export const RatingCard: React.FC<RatingCardProps> = ({ user, index, isCurrentUser }) => {
  const getPositionStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500';
      case 1:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400';
      case 2:
        return 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-700';
      default:
        return 'bg-[#1F1B2E]';
    }
  };

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return '👑';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return index + 1;
    }
  };

  const isTopThree = index < 3;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border ${
        isCurrentUser ? 'border-[#6C3CE1]' : isTopThree ? 'border' : 'border-transparent'
      } ${getPositionStyle(index)}`}
    >
      <div className="text-lg font-bold text-white w-8 text-center">
        {getPositionIcon(index)}
      </div>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#6C3CE1]/20 flex items-center justify-center text-[#6C3CE1]">
          <Rocket size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-white text-sm flex items-center gap-2">
          {user.name}
          {isCurrentUser && (
            <span className="text-xs bg-[#6C3CE1]/20 text-[#6C3CE1] px-2 py-0.5 rounded-full">
              Вы
            </span>
          )}
        </div>
        {user.username && (
          <div className="text-xs text-gray-400">
            @{user.username}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-white">
        <span className="text-sm font-medium">{user.points}</span>
        <Rocket size={18} className="text-[#6C3CE1]" />
      </div>
    </div>
  );
};