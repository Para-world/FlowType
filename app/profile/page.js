"use client";

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { api, getImageUrl } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, AlertTriangle, Upload, Camera } from 'lucide-react';
import ImageCropper from '@/components/ui/ImageCropper';
import styles from './profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, updateUser, logout } = useStore();
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Avatar Upload State
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className="page-header">
        <h1>Profile</h1>
        <p>Please log in to view and edit your profile.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const data = await api.put('/users/profile', profileData);
      updateUser({ 
        username: data.username, 
        email: data.email, 
        name: data.username,
        avatarUrl: data.avatarUrl 
      });
      setStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.put('/users/password', passwordData);
      setStatus({ type: 'success', message: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your stats will be lost.')) {
      return;
    }
    
    setLoading(true);
    try {
      await api.delete('/users/me');
      logout();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBanner}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarLarge} onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
            {user.avatarUrl ? (
              <img src={getImageUrl(user.avatarUrl)} alt="Avatar" className={styles.avatarImage} />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
            <div className={styles.avatarOverlay}>
              <Camera size={24} />
            </div>
          </div>
          <div className={styles.userInfo}>
            <h1>{user.name}</h1>
            <div className={styles.userBadges}>
              <span className={styles.badge}>Level {user.level}</span>
              <span className={styles.badgeXP}>{user.xp} XP</span>
              <span className={styles.badgeStreak}>🔥 {user.streak?.current || 0} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {status.message && (
        <div className={`${styles.alert} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}

      <div className={styles.grid}>
        {/* Account Info */}
        <Card variant="glass" className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Account Details</h3>
            <p className="text-muted">Update your personal information</p>
          </div>
          
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Username</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.icon} />
                <input 
                  type="text" 
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  className={styles.input}
                  required
                  minLength={3}
                  maxLength={20}
                  placeholder="Enter a unique username"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.icon} />
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className={styles.input}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Profile Picture</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} style={{ marginRight: '8px' }} />
                  Choose Image
                </Button>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                  JPEG, PNG, WEBP (Max 2MB)
                </span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (file.size > 2 * 1024 * 1024) {
                      setStatus({ type: 'error', message: 'File must be under 2MB' });
                      return;
                    }
                    const reader = new FileReader();
                    reader.addEventListener('load', () => setImageSrc(reader.result));
                    reader.readAsDataURL(file);
                    e.target.value = ''; // Reset input
                  }
                }}
              />
            </div>

            <div className={styles.submitWrapper}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Password */}
        <Card variant="glass" className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Security</h3>
            <p className="text-muted">Update your password</p>
          </div>
          
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Current Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} />
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className={styles.input}
                  required
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>New Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} />
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className={styles.input}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div className={styles.submitWrapper}>
              <Button type="submit" variant="secondary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card variant="glass" className={`${styles.card} ${styles.dangerZone}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.dangerText}>Danger Zone</h3>
            <p className="text-muted">Permanent account actions</p>
          </div>
          
          <div className={styles.dangerContent}>
            <p>Once you delete your account, there is no going back. All your typing history, stats, and achievements will be permanently erased.</p>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={loading}
              className={styles.deleteBtn}
            >
              <AlertTriangle size={18} style={{ marginRight: '8px' }} />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Cropper Modal */}
      {imageSrc && (
        <ImageCropper 
          imageSrc={imageSrc}
          onCancel={() => setImageSrc(null)}
          onCropComplete={async (croppedBlob) => {
            setImageSrc(null);
            setLoading(true);
            try {
              const formData = new FormData();
              // 'avatar' matches the multer .single('avatar') field name
              formData.append('avatar', croppedBlob, 'profile.jpg');
              
              // Note: our api wrapper expects JSON by default.
              // For FormData, we need to bypass it or use fetch directly.
              const token = localStorage.getItem('flowtype-storage') 
                ? JSON.parse(localStorage.getItem('flowtype-storage'))?.state?.token 
                : '';
                
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/avatar`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                body: formData
              });
              
              const resData = await res.json();
              if (!res.ok) throw new Error(resData.message || 'Upload failed');
              
              updateUser({ avatarUrl: resData.data.avatarUrl });
              setStatus({ type: 'success', message: 'Profile picture updated!' });
            } catch (err) {
              setStatus({ type: 'error', message: err.message });
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}
