"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from '../login/auth.module.css';
import { Lock, Mail, User } from 'lucide-react';

const FacebookIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Register() {
  const router = useRouter();
  const { setAuth } = useStore();
  
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/users/register', formData);
      setAuth(data, data.token);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/users/auth/facebook';
  };

  return (
    <Card variant="elevated" className={styles.authCard}>
      <div className={styles.header}>
        <h2>Create Account</h2>
        <p>Join FlowType to track your progress</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.socialSection}>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.facebookBtn}`}
          onClick={handleFacebookLogin}
          id="facebook-register-btn"
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
          <User size={18} className={styles.icon} />
          <input 
            type="text" 
            placeholder="Username" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required 
            className={styles.input}
          />
        </div>

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
            placeholder="Password (min 6 chars)" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
            className={styles.input}
            minLength={6}
          />
        </div>

        <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className={styles.footer}>
        Already have an account? <Link href="/auth/login" className={styles.link}>Log In</Link>
      </div>
    </Card>
  );
}
