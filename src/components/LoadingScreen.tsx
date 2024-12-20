import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { userService } from '../services/userService';
import { useTelegram } from '../hooks/useTelegram';
import { useQueryClient } from '@tanstack/react-query';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  startAppParam?: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadingComplete,
  startAppParam,
}) => {
  const progressRef = useRef(0);
  const { user } = useTelegram();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (user?.id) {
        // Prefetch initial points
        const points = await userService.getUserPoints(
          user.id,
          user.username || `User_${user.id}`,
          user.first_name,
          user.photo_url
        );
        
        // Set initial data in the query cache
        queryClient.setQueryData(['userPoints', user.id], points);

        // Process referral if startapp parameter exists
        if (startAppParam) {
          try {
            const referrerId = parseInt(atob(startAppParam), 10);
            if (!isNaN(referrerId)) {
              await userService.processReferral(referrerId, user.id);
            }
          } catch (error) {
            console.error('Invalid startapp parameter:', error);
          }
        }
      }
    };

    initializeUser();

    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete();
    }, 3000);

    const progressTimer = setInterval(() => {
      progressRef.current += 3;
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = `${Math.min(progressRef.current, 100)}%`;
      }
      
      if (progressRef.current >= 100) {
        clearInterval(progressTimer);
      }
    }, 90);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onLoadingComplete, startAppParam, user, queryClient]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#160c30] flex flex-col items-center justify-center px-4 overflow-hidden">
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: [-20, 20] }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        className="mb-8"
      >
        <Rocket size={48} className="text-[#6C3CE1]" />
      </motion.div>
      <h1 className="text-3xl font-bold text-white mb-8">МЕДИАРАКЕТА</h1>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          id="progress-bar"
          className="h-full bg-[#6C3CE1]"
          initial={{ width: 0 }}
          style={{ width: '0%' }}
        />
      </div>
      <p className="text-gray-400 text-sm mt-8">made by Gorsky Team</p>
    </div>
  );
};