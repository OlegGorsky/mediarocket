import { create } from 'zustand';
import { Tab } from '../types';

interface Store {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isPromoModalOpen: boolean;
  setPromoModalOpen: (isOpen: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  currentTab: 'rocket', // Set default tab to 'rocket'
  setCurrentTab: (tab) => set({ currentTab: tab }),
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  isPromoModalOpen: false,
  setPromoModalOpen: (isOpen) => set({ isPromoModalOpen: isOpen }),
}));