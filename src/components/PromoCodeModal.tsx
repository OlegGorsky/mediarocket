import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const PromoCodeModal: React.FC = () => {
  const { isPromoModalOpen, setPromoModalOpen } = useStore();
  const { user } = useTelegram();
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !promoCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await api.claimKeyword(user.id, promoCode.trim());
      if (result.status === 'success') {
        toast.success('Промокод успешно применен!');
        setPromoModalOpen(false);
        setPromoCode('');
      } else {
        toast.error(result.reason || 'Промокод уже использован или недействителен');
      }
    } catch (error) {
      console.error('Error submitting promo code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPromoModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-[#160c30] rounded-t-2xl w-full h-1/2 p-6 relative">
        <button
          onClick={() => setPromoModalOpen(false)}
          className="absolute right-4 top-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold mb-6 text-white">Ввести промокод</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Введите промокод"
            className="w-full p-3 border rounded-lg bg-[#1F1B2E] text-white border-gray-700 placeholder-gray-400 focus:border-[#6C3CE1] focus:ring-1 focus:ring-[#6C3CE1] outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !promoCode.trim()}
            className="w-full bg-[#6C3CE1] text-white py-3 rounded-lg font-medium hover:bg-[#5B32C1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Проверяем...' : 'Активировать'}
          </button>
        </form>
      </div>
    </div>
  );
};