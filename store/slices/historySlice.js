export const createHistorySlice = (set) => ({
  history: [], // Array of test result objects
  addTestResult: (result) =>
    set((state) => ({
      history: [
        { ...result, date: new Date().toISOString(), id: crypto.randomUUID() },
        ...state.history,
      ].slice(0, 100), // Keep last 100 results
    })),
  setHistory: (historyData) => set({ history: historyData }),
  clearHistory: () => set({ history: [] }),
});
