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
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
  },
});
