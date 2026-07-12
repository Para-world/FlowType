"use client";

import styles from './ModuleSelector.module.css';

const modules = [
  { id: 'words', icon: '≡', label: 'words' },
  { id: 'capitals', icon: 'A', label: 'capitals' },
  { id: 'numbers', icon: '#', label: 'numbers' },
  { id: 'symbols', icon: '+', label: 'symbols' },
  { id: 'punctuation', icon: '.?', label: 'punctuation' },
  { id: 'code', icon: '</>', label: 'code' },
  { id: 'mixed', icon: '⊞', label: 'mixed' }
];

export default function ModuleSelector({ currentModule, onModuleChange }) {
  return (
    <div className={styles.container}>
      {modules.map(mod => (
        <button
          key={mod.id}
          className={`${styles.btn} ${currentModule === mod.id ? styles.active : ''}`}
          onClick={() => onModuleChange(mod.id)}
        >
          <span className={styles.icon}>{mod.icon}</span>
          <span>{mod.label}</span>
        </button>
      ))}
    </div>
  );
}
