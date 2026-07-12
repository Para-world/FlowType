"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import styles from '../login/auth.module.css';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      setError('Invalid callback — missing authentication data.');
      setTimeout(() => router.push('/auth/login'), 3000);
      return;
    }

    // Temporarily set the token so the API helper can use it
    // Then fetch the full user profile
    const authenticateUser = async () => {
      try {
        // First, set a minimal auth state so the token is available for API calls
        setAuth({ _id: userId, token }, token);

        // Fetch the full user data from the backend
        const userData = await api.get('/users/me');
        
        // Update with the complete user data
        setAuth({ ...userData, token }, token);

        // Redirect to dashboard
        router.push('/');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Failed to complete login. Please try again.');
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    authenticateUser();
  }, [searchParams, setAuth, router]);

  return (
    <Card variant="elevated" className={styles.callbackCard}>
      {error ? (
        <>
          <h2 className={styles.callbackError}>Login Failed</h2>
          <p>{error}</p>
          <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>Redirecting to login...</p>
        </>
      ) : (
        <>
          <div className={styles.spinner} />
          <h2>Signing you in...</h2>
          <p>Please wait while we complete your login.</p>
        </>
      )}
    </Card>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <Card variant="elevated" className={styles.callbackCard}>
        <div className={styles.spinner} />
        <h2>Loading...</h2>
      </Card>
    }>
      <CallbackContent />
    </Suspense>
  );
}
