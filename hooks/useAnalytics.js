import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/store/useStore';

export function useAnalytics(initialRange = 30) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(initialRange);
  const { isAuthenticated } = useStore();

  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/stats/analytics?range=${range}`);
      setData(response);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [range, isAuthenticated]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    range,
    setRange,
    refetch: fetchAnalytics,
  };
}
