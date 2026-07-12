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

  return (
    <Card variant="elevated" className={styles.authCard}>
      <div className={styles.header}>
        <h2>Create Account</h2>
        <p>Join FlowType to track your progress</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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
