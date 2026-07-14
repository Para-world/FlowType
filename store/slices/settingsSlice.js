export const createSettingsSlice = (set) => ({
  settings: {
    themeAccent: 0, // 0: violet, 1: cyan, 2: emerald, 3: rose, 4: amber
    fontSize: 'md', // sm, md, lg
    fontFamily: 'mono', // sans, mono
    cursorStyle: 'line', // line, block, underline
    soundEnabled: true,
    soundProfile: 'brown', // blue, brown, red
    soundVolume: 50, // 0-100
    animationLevel: 'full', // full, reduced, none
    keyboardGuide: true,
    timerDisplay: true,
    wpmDisplay: true,
    accuracyDisplay: true,
    progressBar: true,
    focusMode: false,
    zenMode: false,
  },
    updateSettings: async (updates, skipApiSync = false) => {
      set((state) => ({
        settings: { ...state.settings, ...updates },
      }));
      
      const state = set; // Next.js zustand slices often use get()
      // Wait, in our setup we don't have get() injected easily unless we modify store creation.
      // We'll handle backend sync in the components for now, or just use api directly if we have the token in localStorage.
      
      // We will handle backend API sync inside a useEffect or directly from the UI component to keep the store pure.
    },
});
