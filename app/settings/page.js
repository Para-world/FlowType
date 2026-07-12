"use client";

import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

const themes = [
  { id: 0, name: 'Violet', color: '#a78bfa' },
  { id: 1, name: 'Cyan', color: '#22d3ee' },
  { id: 2, name: 'Emerald', color: '#34d399' },
  { id: 3, name: 'Rose', color: '#fb7185' },
  { id: 4, name: 'Amber', color: '#fbbf24' },
];

export default function Settings() {
  const { settings, updateSettings, isAuthenticated } = useStore();
  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = async (updates) => {
    updateSettings(updates);
    
    if (isAuthenticated) {
      setSaveStatus('Saving...');
      try {
        await api.put('/users/settings', updates);
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        setSaveStatus('Failed to save');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Customize your typing experience.</p>
        </div>
        {saveStatus && <span className={styles.saveStatus}>{saveStatus}</span>}
      </div>

      <div className={styles.grid}>
        {/* Appearance */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          
          <div className={styles.settingGroup}>
            <label className={styles.label}>Theme Accent</label>
            <div className={styles.themeOptions}>
              {themes.map(t => (
                <button
                  key={t.id}
                  className={`${styles.themeBtn} ${settings.themeAccent === t.id ? styles.activeTheme : ''}`}
                  style={{ '--btn-color': t.color }}
                  onClick={() => handleChange({ themeAccent: t.id })}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>Font Family</label>
            <select 
              value={settings.fontFamily} 
              onChange={(e) => handleChange({ fontFamily: e.target.value })}
              className={styles.select}
            >
              <option value="mono">Fira Code (Monospace)</option>
              <option value="sans">Inter (Sans-serif)</option>
              <option value="serif">Merriweather (Serif)</option>
            </select>
          </div>
        </Card>

        {/* Caret & Behavior */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Caret & Behavior</h2>
          
          <div className={styles.settingGroup}>
            <label className={styles.label}>Cursor Style</label>
            <select 
              value={settings.cursorStyle} 
              onChange={(e) => handleChange({ cursorStyle: e.target.value })}
              className={styles.select}
            >
              <option value="line">Line (|)</option>
              <option value="block">Block (█)</option>
              <option value="underline">Underline (_)</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>Typing Sound</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleBtn} ${settings.soundEnabled ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ soundEnabled: true })}
              >On</button>
              <button 
                className={`${styles.toggleBtn} ${!settings.soundEnabled ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ soundEnabled: false })}
              >Off</button>
            </div>
          </div>
        </Card>

        {/* Interface */}
        <Card className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Interface</h2>
          
          <div className={styles.settingGroup}>
            <label className={styles.label}>Live WPM</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleBtn} ${settings.wpmDisplay ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ wpmDisplay: true })}
              >Show</button>
              <button 
                className={`${styles.toggleBtn} ${!settings.wpmDisplay ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ wpmDisplay: false })}
              >Hide</button>
            </div>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>Timer/Progress</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleBtn} ${settings.timerDisplay ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ timerDisplay: true })}
              >Show</button>
              <button 
                className={`${styles.toggleBtn} ${!settings.timerDisplay ? styles.activeToggle : ''}`}
                onClick={() => handleChange({ timerDisplay: false })}
              >Hide</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
