import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUserSlice } from './slices/userSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createHistorySlice } from './slices/historySlice';

export const useStore = create(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createSettingsSlice(...a),
      ...createHistorySlice(...a),
    }),
    {
      name: 'flowtype-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
