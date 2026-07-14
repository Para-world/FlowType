"use client";

import { useStore } from '@/store/useStore';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';
import { useState } from 'react';
import styles from './SoundToggle.module.css';

export default function SoundToggle() {
  const { settings, updateSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleProfileChange = (profile) => {
    updateSettings({ soundProfile: profile });
  };

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.mainBtn} ${settings.soundEnabled ? styles.active : ''}`}
        onClick={toggleSound}
        onMouseEnter={() => setIsOpen(true)}
        title="Toggle Sound"
      >
        {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {isOpen && settings.soundEnabled && (
        <div 
          className={styles.popout}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className={styles.group}>
            <span className={styles.label}>Switch</span>
            <div className={styles.options}>
              <button 
                className={`${styles.optBtn} ${settings.soundProfile === 'blue' ? styles.activeOpt : ''}`}
                onClick={() => handleProfileChange('blue')}
                title="Cherry MX Blue (Clicky)"
              >
                Blue
              </button>
              <button 
                className={`${styles.optBtn} ${settings.soundProfile === 'brown' ? styles.activeOpt : ''}`}
                onClick={() => handleProfileChange('brown')}
                title="Cherry MX Brown (Tactile)"
              >
                Brown
              </button>
              <button 
                className={`${styles.optBtn} ${settings.soundProfile === 'red' ? styles.activeOpt : ''}`}
                onClick={() => handleProfileChange('red')}
                title="Cherry MX Red (Silent)"
              >
                Red
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
