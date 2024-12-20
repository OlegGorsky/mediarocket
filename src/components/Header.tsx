import React from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { X } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, onClose } = useTelegram();

  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {user?.username ? `@${user.username}` : 'Telegram User'}
        </span>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-blue-700 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
    </header>
  );
};