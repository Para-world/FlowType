"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './auth.module.css';
import { Lock, Mail } from 'lucide-react';

const FacebookIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useStore();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Show error if redirected back from failed OAuth
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const messages = {
        facebook_denied: 'Facebook login was cancelled.',
        facebook_token_failed: 'Failed to authenticate with Facebook. Please try again.',
        facebook_profile_failed: 'Could not retrieve your Facebook profile.',
        google_denied: 'Google login was cancelled.',
        google_token_failed: 'Failed to authenticate with Google. Please try again.',
        google_profile_failed: 'Could not retrieve your Google profile.',
      };
      setError(messages[oauthError] || 'Social login failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/users/login', formData);
      setAuth(data, data.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/users/auth/facebook';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/users/auth/google';
  };

  return (
    <Card variant="elevated" className={styles.authCard}>
      <div className={styles.header}>
        <h2>Welcome Back</h2>
        <p>Login to sync your FlowType stats</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.socialSection}>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.googleBtn}`}
          onClick={handleGoogleLogin}
          id="google-login-btn"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.facebookBtn}`}
          onClick={handleFacebookLogin}
          id="facebook-login-btn"
        >
          <FacebookIcon />
          Continue with Facebook
        </button>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <Mail size={18} className={styles.icon} />
          <input 
            type="email" 
            placeholder="Email address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <Lock size={18} className={styles.icon} />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
            className={styles.input}
          />
        </div>

        <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className={styles.footer}>
        Don't have an account? <Link href="/auth/register" className={styles.link}>Sign Up</Link>
      </div>
    </Card>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
