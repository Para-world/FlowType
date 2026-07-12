"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './auth.module.css';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { setAuth } = useStore();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <Card variant="elevated" className={styles.authCard}>
      <div className={styles.header}>
        <h2>Welcome Back</h2>
        <p>Login to sync your FlowType stats</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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
