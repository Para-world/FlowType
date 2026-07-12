export const createUserSlice = (set) => ({
  user: {
    name: 'Guest User',
    username: 'guest',
    email: '',
    avatarUrl: '',
    avatar: 0,
    level: 1,
    xp: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null },
    stats: {
      totalPracticeTime: 0,
      totalTests: 0,
      totalWordsTyped: 0,
      totalCharsTyped: 0,
      bestWpm: 0,
      avgWpm: 0,
      bestAccuracy: 0,
      avgAccuracy: 0,
    },
    achievements: [],
    lessons: { completed: [] },
  },
  token: null, // JWT token for backend authentication
  isAuthenticated: false,

  setAuth: (userData, token) => 
    set(() => ({
      user: {
        ...userData,
        name: userData.username,
      },
      token,
      isAuthenticated: true,
    })),

  logout: () => 
    set(() => ({
      user: {
        name: 'Guest User',
        username: 'guest',
        email: '',
        avatarUrl: '',
        avatar: 0,
        level: 1,
        xp: 0,
        streak: { current: 0, longest: 0, lastActiveDate: null },
        stats: {
          totalPracticeTime: 0,
          totalTests: 0,
          totalWordsTyped: 0,
          totalCharsTyped: 0,
          bestWpm: 0,
          avgWpm: 0,
          bestAccuracy: 0,
          avgAccuracy: 0,
        },
        achievements: [],
        lessons: { completed: [] },
      },
      token: null,
      isAuthenticated: false,
    })),

  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
  addXp: (amount) =>
    set((state) => {
      const newXp = state.user.xp + (amount || 0);
      const nextLevelXp = state.user.level * 1000; // simple leveling formula
      if (newXp >= nextLevelXp) {
        return {
          user: {
            ...state.user,
            xp: newXp - nextLevelXp,
            level: state.user.level + 1,
          },
        };
      }
      return { user: { ...state.user, xp: newXp } };
    }),
});
