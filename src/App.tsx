import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { PromoCodeModal } from './components/PromoCodeModal';
import { RocketPage } from './pages/RocketPage';
import { FriendsPage } from './pages/FriendsPage';
import { TasksPage } from './pages/TasksPage';
import { RatingPage } from './pages/RatingPage';
import { ExpertsPage } from './pages/ExpertsPage';
import { LoadingScreen } from './components/LoadingScreen';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { currentTab } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const startAppParam = new URLSearchParams(window.location.search).get('startapp');

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsLoading(false);
    } else {
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'rocket':
        return <RocketPage />;
      case 'friends':
        return <FriendsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'rating':
        return <RatingPage />;
      case 'experts':
        return <ExpertsPage />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} startAppParam={startAppParam} />;
  }

  return (
    <div className="min-h-screen bg-gradient-animate">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="min-h-screen pb-16"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      <Navigation />
      <PromoCodeModal />
    </div>
  );
};

export default App;