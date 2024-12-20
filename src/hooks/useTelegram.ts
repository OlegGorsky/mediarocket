import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export const useTelegram = () => {
  const [user, setUser] = useState(WebApp.initDataUnsafe?.user);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    // Set theme colors
    WebApp.setHeaderColor('#160c30');
    WebApp.setBackgroundColor('#160c30');
  }, []);

  const onClose = () => {
    WebApp.close();
  };

  return {
    user,
    onClose,
    tg: WebApp,
  };
};