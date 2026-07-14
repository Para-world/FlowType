import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';

/**
 * A Web Audio API synthesizer for mechanical keyboard sounds.
 * Generates sounds mathematically to achieve zero latency and avoid network requests.
 */
class MechanicalSynth {
  constructor() {
    this.audioCtx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  /**
   * Generates a short burst of noise (for the "click/clack" texture)
   */
  createNoiseBuffer() {
    if (!this.audioCtx) return null;
    const bufferSize = this.audioCtx.sampleRate * 0.05; // 50ms of noise
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  play(profile = 'brown', volume = 0.5) {
    if (!this.initialized) this.init();
    if (!this.audioCtx) return;

    // Resume audio context if browser suspended it
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const t = this.audioCtx.currentTime;

    // Master volume control for this keystroke
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(this.audioCtx.destination);

    // --- Sound Profiles ---
    
    if (profile === 'blue') {
      // Cherry MX Blue (Clicky)
      // High pitch snap + noise
      
      // 1. The high pitch "click"
      const osc = this.audioCtx.createOscillator();
      osc.type = 'triangle';
      
      // Randomize pitch slightly for realism
      const baseFreq = 3000 + Math.random() * 200;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(1000, t + 0.02);

      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.3, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.03);

      // 2. The physical "clack" (noise)
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1500;
      filter.Q.value = 1.5;

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(t);

    } else if (profile === 'brown') {
      // Cherry MX Brown (Tactile/Thock)
      // Lower pitch, thud + subtle noise
      
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      
      const baseFreq = 400 + Math.random() * 50;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.04);

      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.6, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.05);

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.3, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(t);
      
    } else if (profile === 'red') {
      // Cherry MX Red (Linear/Silent)
      // Very soft, mostly low frequency thud from bottoming out
      
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      
      const baseFreq = 200 + Math.random() * 20;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.03);

      const oscGain = this.audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.4, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.03);
    }
  }
}

// Singleton instance
const synth = new MechanicalSynth();

export function useSoundEngine() {
  const { settings } = useStore();
  
  // Only init when needed
  const initSound = useCallback(() => {
    synth.init();
  }, []);

  const playKeystroke = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // We can map settings.soundProfile to our synth
    const profile = settings.soundProfile || 'brown';
    const volume = (settings.soundVolume || 50) / 100;
    
    synth.play(profile, volume);
  }, [settings.soundEnabled, settings.soundProfile, settings.soundVolume]);

  const playError = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Play a distinct error sound (a slight discordant double-tap)
    const volume = (settings.soundVolume || 50) / 100;
    synth.play('brown', volume * 0.5);
    setTimeout(() => {
      synth.play('brown', volume * 0.3);
    }, 40);
  }, [settings.soundEnabled, settings.soundVolume]);

  return {
    initSound,
    playKeystroke,
    playError
  };
}
