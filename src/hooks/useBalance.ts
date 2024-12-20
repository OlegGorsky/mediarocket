import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from './useTelegram';

export const useBalance = () => {
  const { user } = useTelegram();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.id) return;
      
      try {
        const response = await axios.get(`YOUR_BALANCE_ENDPOINT/${user.id}`);
        setBalance(response.data.balance || 0);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [user?.id]);

  return { balance, isLoading };
};