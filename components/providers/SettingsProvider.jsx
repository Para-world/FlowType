"use client";

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

const themeColors = {
  0: { accent: '#a78bfa', hover: '#8b5cf6' }, // Violet
  1: { accent: '#22d3ee', hover: '#06b6d4' }, // Cyan
  2: { accent: '#34d399', hover: '#10b981' }, // Emerald
  3: { accent: '#fb7185', hover: '#f43f5e' }, // Rose
  4: { accent: '#fbbf24', hover: '#f59e0b' }, // Amber
};

export default function SettingsProvider({ children }) {
  const { settings } = useStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply Theme Colors
    const theme = themeColors[settings.themeAccent] || themeColors[0];
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.hover);

    // Apply Font Family
    let fontFamily = 'var(--font-mono)';
    if (settings.fontFamily === 'sans') fontFamily = 'var(--font-sans)';
    if (settings.fontFamily === 'serif') fontFamily = 'Georgia, serif';
    
    // We apply this strictly to the words display so it doesn't break the UI
    root.style.setProperty('--typing-font', fontFamily);

  }, [settings.themeAccent, settings.fontFamily]);

  return <>{children}</>;
}
