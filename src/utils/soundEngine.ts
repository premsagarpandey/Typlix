/**
 * Typlix Sound Engine
 * Procedural mechanical keyboard sound synthesis using Web Audio API.
 * Each profile uses layered oscillators, noise bursts, and envelope shaping
 * to create unique, realistic keystroke sounds — no audio files needed.
 */

import { secureStorage } from './secureStorage';
import { checkIsPhone } from '../hooks/useIsMobile';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SoundProfileId =
  | 'cherry-mx-blue'
  | 'cherry-mx-red'
  | 'cherry-mx-brown'
  | 'creamy-thock'
  | 'typewriter';

export interface SoundProfileMeta {
  id: SoundProfileId;
  name: string;
  description: string;
  icon: string;
}

interface OscLayer {
  type: OscillatorType;
  freq: number;
  freqEnd?: number;
  gain: number;
  attack: number;
  decay: number;
  duration: number;
  detune?: number;
}

interface NoiseLayer {
  gain: number;
  attack: number;
  decay: number;
  duration: number;
  filterFreq: number;
  filterQ: number;
  filterType: BiquadFilterType;
}

interface SoundProfileConfig {
  keydown: {
    oscillators: OscLayer[];
    noise?: NoiseLayer;
  };
  error: {
    oscillators: OscLayer[];
    noise?: NoiseLayer;
  };
}

// ─── Profile Metadata ────────────────────────────────────────────────────────

export const SOUND_PROFILES: SoundProfileMeta[] = [
  {
    id: 'cherry-mx-blue',
    name: 'Cherry MX Blue',
    description: 'Clicky & tactile',
    icon: '🔵',
  },
  {
    id: 'cherry-mx-red',
    name: 'Cherry MX Red',
    description: 'Linear & smooth',
    icon: '🔴',
  },
  {
    id: 'cherry-mx-brown',
    name: 'Cherry MX Brown',
    description: 'Tactile bump',
    icon: '🟤',
  },
  {
    id: 'creamy-thock',
    name: 'Creamy Thock',
    description: 'Deep & satisfying',
    icon: '🧈',
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    description: 'Classic vintage',
    icon: '⌨️',
  },
];

// ─── Profile Synthesis Configs ───────────────────────────────────────────────

const PROFILE_CONFIGS: Record<SoundProfileId, SoundProfileConfig> = {
  'cherry-mx-blue': {
    keydown: {
      oscillators: [
        // Sharp click — high-pitched spike
        { type: 'square', freq: 4200, freqEnd: 1800, gain: 0.18, attack: 0.001, decay: 0.015, duration: 0.025 },
        // Body resonance
        { type: 'sine', freq: 1400, freqEnd: 600, gain: 0.12, attack: 0.001, decay: 0.025, duration: 0.04 },
        // Bottom-out thump
        { type: 'sine', freq: 180, freqEnd: 80, gain: 0.10, attack: 0.002, decay: 0.03, duration: 0.045 },
      ],
      noise: { gain: 0.08, attack: 0.001, decay: 0.02, duration: 0.03, filterFreq: 6000, filterQ: 1.5, filterType: 'bandpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 280, freqEnd: 150, gain: 0.12, attack: 0.002, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 140, freqEnd: 80, gain: 0.08, attack: 0.003, decay: 0.08, duration: 0.10 },
      ],
      noise: { gain: 0.05, attack: 0.002, decay: 0.05, duration: 0.07, filterFreq: 800, filterQ: 2, filterType: 'lowpass' },
    },
  },

  'cherry-mx-red': {
    keydown: {
      oscillators: [
        // Soft linear bottom-out
        { type: 'sine', freq: 600, freqEnd: 200, gain: 0.10, attack: 0.003, decay: 0.025, duration: 0.035 },
        // Low body thud
        { type: 'sine', freq: 120, freqEnd: 60, gain: 0.12, attack: 0.002, decay: 0.04, duration: 0.05 },
      ],
      noise: { gain: 0.04, attack: 0.002, decay: 0.018, duration: 0.025, filterFreq: 3000, filterQ: 0.8, filterType: 'lowpass' },
    },
    error: {
      oscillators: [
        { type: 'triangle', freq: 220, freqEnd: 120, gain: 0.10, attack: 0.003, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 100, freqEnd: 60, gain: 0.07, attack: 0.004, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.03, attack: 0.003, decay: 0.04, duration: 0.06, filterFreq: 600, filterQ: 1.5, filterType: 'lowpass' },
    },
  },

  'cherry-mx-brown': {
    keydown: {
      oscillators: [
        // Tactile bump — mid-freq pulse
        { type: 'square', freq: 2800, freqEnd: 1200, gain: 0.10, attack: 0.001, decay: 0.012, duration: 0.02 },
        // Warm body
        { type: 'sine', freq: 800, freqEnd: 350, gain: 0.12, attack: 0.002, decay: 0.03, duration: 0.04 },
        // Subtle bottom-out
        { type: 'sine', freq: 150, freqEnd: 70, gain: 0.09, attack: 0.003, decay: 0.035, duration: 0.045 },
      ],
      noise: { gain: 0.05, attack: 0.001, decay: 0.015, duration: 0.025, filterFreq: 4500, filterQ: 1.2, filterType: 'bandpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 250, freqEnd: 140, gain: 0.10, attack: 0.002, decay: 0.06, duration: 0.08 },
        { type: 'sine', freq: 120, freqEnd: 70, gain: 0.07, attack: 0.003, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.04, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 700, filterQ: 1.8, filterType: 'lowpass' },
    },
  },

  'creamy-thock': {
    keydown: {
      oscillators: [
        // Deep thock — low and heavy
        { type: 'sine', freq: 250, freqEnd: 80, gain: 0.18, attack: 0.002, decay: 0.06, duration: 0.08 },
        // Body resonance — warm mid
        { type: 'sine', freq: 500, freqEnd: 180, gain: 0.10, attack: 0.003, decay: 0.05, duration: 0.07, detune: -15 },
        // Sub bass
        { type: 'sine', freq: 80, freqEnd: 40, gain: 0.14, attack: 0.003, decay: 0.07, duration: 0.09 },
      ],
      noise: { gain: 0.06, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 1800, filterQ: 0.7, filterType: 'lowpass' },
    },
    error: {
      oscillators: [
        { type: 'triangle', freq: 200, freqEnd: 100, gain: 0.12, attack: 0.003, decay: 0.07, duration: 0.09 },
        { type: 'sine', freq: 80, freqEnd: 45, gain: 0.09, attack: 0.004, decay: 0.08, duration: 0.10 },
      ],
      noise: { gain: 0.04, attack: 0.003, decay: 0.05, duration: 0.07, filterFreq: 500, filterQ: 1, filterType: 'lowpass' },
    },
  },

  typewriter: {
    keydown: {
      oscillators: [
        // Metallic clack — bright and sharp
        { type: 'square', freq: 5500, freqEnd: 2200, gain: 0.12, attack: 0.0005, decay: 0.01, duration: 0.018 },
        // Hammer strike — percussive mid
        { type: 'sawtooth', freq: 1800, freqEnd: 600, gain: 0.10, attack: 0.001, decay: 0.02, duration: 0.03 },
        // Mechanical linkage rattle
        { type: 'square', freq: 3200, freqEnd: 1000, gain: 0.06, attack: 0.001, decay: 0.015, duration: 0.025, detune: 25 },
        // Platen thud
        { type: 'sine', freq: 200, freqEnd: 80, gain: 0.10, attack: 0.002, decay: 0.04, duration: 0.05 },
      ],
      noise: { gain: 0.10, attack: 0.0005, decay: 0.025, duration: 0.035, filterFreq: 8000, filterQ: 0.5, filterType: 'highpass' },
    },
    error: {
      oscillators: [
        { type: 'sawtooth', freq: 320, freqEnd: 160, gain: 0.10, attack: 0.002, decay: 0.05, duration: 0.07 },
        { type: 'sine', freq: 160, freqEnd: 90, gain: 0.07, attack: 0.003, decay: 0.06, duration: 0.08 },
      ],
      noise: { gain: 0.06, attack: 0.002, decay: 0.04, duration: 0.06, filterFreq: 900, filterQ: 1.5, filterType: 'lowpass' },
    },
  },
};

// ─── Sound Engine & High-Performance Audio Cache ─────────────────────────────

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let keepAliveActive = false;

// In-memory cache of user audio settings to eliminate synchronous localStorage reads on keystroke
let cachedSoundEnabled = typeof window !== 'undefined' ? !checkIsPhone() : true;
let cachedProfileId: SoundProfileId = 'cherry-mx-blue';
let cachedSoundVolume = 70;
let settingsInitialized = false;
let listenersAttached = false;
let unlockListenersAttached = false;
let variationIndex = 0;

interface ProfileBuffers {
  keydown: AudioBuffer[];
  space: AudioBuffer;
  error: AudioBuffer;
}

const profileBufferCache = new Map<SoundProfileId, ProfileBuffers>();
const pendingPreRenders = new Set<SoundProfileId>();

/**
 * Returns or initializes the shared AudioContext with interactive low-latency mode.
 */
function ensureAudioContext(): { ctx: AudioContext; master: GainNode } | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;

      audioCtx = new AudioContextClass({ latencyHint: 'interactive' });
      masterGain = audioCtx.createGain();
      const vol = Math.max(0, Math.min(cachedSoundVolume, 100)) / 100;
      masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      startHardwareKeepAlive(audioCtx);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return { ctx: audioCtx, master: masterGain! };
  } catch {
    return null;
  }
}

/**
 * Anti-DAC-Sleep Keep-Alive stream.
 * Prevents OS audio hardware, DirectSound/WASAPI, and Bluetooth A2DP DACs from
 * entering power-saving sleep when the user pauses typing. Eliminates the common
 * 100ms first-keystroke latency spike and clipped initial transient.
 */
function startHardwareKeepAlive(ctx: AudioContext): void {
  if (keepAliveActive) return;
  keepAliveActive = true;

  try {
    const sampleRate = ctx.sampleRate || 44100;
    const buffer = ctx.createBuffer(1, sampleRate, sampleRate);
    const channel = buffer.getChannelData(0);
    // Inaudible micro-dither: signal level ~1e-6 scaled by 0.0001 gain = 1e-10 (-200 dB).
    // Completely inaudible to human ears, but tells the audio driver the stream is active.
    for (let i = 0; i < channel.length; i++) {
      channel[i] = (Math.random() * 2 - 1) * 1e-6;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const keepAliveGain = ctx.createGain();
    keepAliveGain.gain.setValueAtTime(0.0001, ctx.currentTime);

    source.connect(keepAliveGain);
    keepAliveGain.connect(ctx.destination);
    source.start(0);
  } catch {
    // If not supported, continue gracefully
  }
}

/**
 * Eagerly unlock and warm up Web Audio on the very first user interaction.
 * By the time the user types their first character, the audio pipeline is already running.
 */
function setupAudioUnlockListeners(): void {
  if (typeof window === 'undefined' || unlockListenersAttached) return;
  unlockListenersAttached = true;

  const unlock = () => {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('mousedown', unlock, true);
    }
  };

  window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  window.addEventListener('keydown', unlock, { capture: true, passive: true });
  window.addEventListener('touchstart', unlock, { capture: true, passive: true });
  window.addEventListener('mousedown', unlock, { capture: true, passive: true });

  window.addEventListener('focus', () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  });
}

/**
 * Procedurally render a mechanical sound profile into pristine, studio-quality AudioBuffers
 * using OfflineAudioContext. Pre-rendering eliminates all runtime oscillator synthesis,
 * avoids exponential ramp deadline misses, eliminates setTimeout voice leaks, and drops
 * keystroke audio trigger time to sub-millisecond speeds.
 */
async function renderSoundProfileToBuffers(
  profileId: SoundProfileId,
  sampleRate: number = 44100
): Promise<ProfileBuffers | null> {
  const config = PROFILE_CONFIGS[profileId];
  if (!config) return null;

  try {
    const OfflineAudioClass =
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;

    if (!OfflineAudioClass) return null;

    const renderSingleBuffer = async (
      layerConfig: SoundProfileConfig['keydown'],
      options: { pitchMult?: number; durMult?: number; gainBoost?: number; freqOffset?: number } = {}
    ): Promise<AudioBuffer> => {
      const { pitchMult = 1.0, durMult = 1.0, gainBoost = 1.0, freqOffset = 1.0 } = options;

      let maxDuration = 0.08;
      for (const osc of layerConfig.oscillators) {
        const d = osc.duration * durMult;
        if (d > maxDuration) maxDuration = d;
      }
      if (layerConfig.noise) {
        const d = layerConfig.noise.duration * durMult;
        if (d > maxDuration) maxDuration = d;
      }

      // Add a 20ms decay tail so waveform naturally settles to absolute 0, preventing clicks or cuts
      const totalDuration = maxDuration + 0.02;
      const length = Math.ceil(totalDuration * sampleRate);

      const offlineCtx = new OfflineAudioClass(1, length, sampleRate);
      const now = 0;

      const master = offlineCtx.createGain();
      master.gain.setValueAtTime(gainBoost, now);
      master.connect(offlineCtx.destination);

      // Render oscillator layers
      for (const layer of layerConfig.oscillators) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        const layerDuration = layer.duration * durMult;

        osc.type = layer.type;
        const baseFreq = layer.freq * pitchMult * freqOffset;
        osc.frequency.setValueAtTime(baseFreq, now);

        if (layer.freqEnd) {
          const endFreq = Math.max(layer.freqEnd * pitchMult * freqOffset, 20);
          osc.frequency.exponentialRampToValueAtTime(endFreq, now + layerDuration);
        }
        if (layer.detune) {
          osc.detune.setValueAtTime(layer.detune, now);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(layer.gain, now + layer.attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + layer.attack + layer.decay);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + layerDuration + 0.015);
      }

      // Render noise burst layer
      if (layerConfig.noise) {
        const nl = layerConfig.noise;
        const noiseBuf = offlineCtx.createBuffer(1, length, sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < length; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = offlineCtx.createBufferSource();
        noiseSource.buffer = noiseBuf;

        const noiseFilter = offlineCtx.createBiquadFilter();
        noiseFilter.type = nl.filterType;
        noiseFilter.frequency.setValueAtTime(nl.filterFreq, now);
        noiseFilter.Q.setValueAtTime(nl.filterQ, now);

        const noiseGain = offlineCtx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(nl.gain, now + nl.attack);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + nl.attack + nl.decay);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);

        noiseSource.start(now);
        noiseSource.stop(now + nl.duration * durMult + 0.015);
      }

      const promise = offlineCtx.startRendering();
      if (promise && typeof promise.then === 'function') {
        return await promise;
      }
      return await new Promise<AudioBuffer>((resolve, reject) => {
        offlineCtx.oncomplete = (e) => resolve(e.renderedBuffer);
        setTimeout(() => reject(new Error('Audio render timeout')), 1000);
      });
    };

    // Pre-render 3 acoustic micro-variations for standard keys, 1 deep spacebar, and 1 error buffer
    const [var0, var1, var2, space, error] = await Promise.all([
      renderSingleBuffer(config.keydown, { freqOffset: 1.0 }),
      renderSingleBuffer(config.keydown, { freqOffset: 1.018 }),
      renderSingleBuffer(config.keydown, { freqOffset: 0.982 }),
      renderSingleBuffer(config.keydown, { pitchMult: 0.82, durMult: 1.20, gainBoost: 1.08 }),
      renderSingleBuffer(config.error, { freqOffset: 1.0 }),
    ]);

    const result: ProfileBuffers = {
      keydown: [var0, var1, var2],
      space,
      error,
    };

    profileBufferCache.set(profileId, result);
    return result;
  } catch {
    return null;
  }
}

/**
 * Pre-warms buffers for a given profile in background.
 */
function warmupProfile(profileId: SoundProfileId): void {
  if (profileBufferCache.has(profileId) || pendingPreRenders.has(profileId)) return;
  pendingPreRenders.add(profileId);

  const sampleRate = audioCtx ? audioCtx.sampleRate : 44100;
  renderSoundProfileToBuffers(profileId, sampleRate).finally(() => {
    pendingPreRenders.delete(profileId);
  });
}

/**
 * Warm up all profile audio buffers smoothly.
 */
function warmupAllProfiles(): void {
  warmupProfile(cachedProfileId);

  const warmupOthers = () => {
    for (const p of SOUND_PROFILES) {
      if (p.id !== cachedProfileId) {
        warmupProfile(p.id);
      }
    }
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(warmupOthers);
    } else {
      setTimeout(warmupOthers, 150);
    }
  }
}

export function initCachedSettings(): void {
  if (typeof window === 'undefined') return;

  if (!settingsInitialized) {
    settingsInitialized = true;
    try {
      const defaultSound = !checkIsPhone();
      cachedSoundEnabled = secureStorage.getItem<boolean>('sound', defaultSound);
      cachedProfileId = secureStorage.getItem<SoundProfileId>('soundProfile', 'cherry-mx-blue');
      cachedSoundVolume = secureStorage.getItem<number>('soundVolume', 70);
    } catch {
      // fallback to defaults
    }

    setupAudioUnlockListeners();
    warmupAllProfiles();
  }

  // Strictly attach event listeners ONCE to prevent exponential listener leaks
  if (!listenersAttached) {
    listenersAttached = true;

    // Direct in-memory event listener: updates memory cache instantly without touching disk or crypto
    window.addEventListener('typlix_settings_changed', ((e: CustomEvent<{ key?: string; value?: unknown }>) => {
      if (!e.detail) return;
      const { key, value } = e.detail;
      if (key === 'sound' && typeof value === 'boolean') {
        cachedSoundEnabled = value;
      } else if (key === 'soundProfile' && typeof value === 'string') {
        cachedProfileId = value as SoundProfileId;
        warmupProfile(cachedProfileId);
      } else if (key === 'soundVolume' && typeof value === 'number') {
        cachedSoundVolume = value;
        if (masterGain && audioCtx) {
          const vol = Math.max(0, Math.min(value, 100)) / 100;
          masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
        }
      }
    }) as EventListener);

    // Cross-tab synchronization
    window.addEventListener('storage', (e: StorageEvent) => {
      try {
        if (e.key === 'sound') {
          cachedSoundEnabled = secureStorage.getItem<boolean>('sound', !checkIsPhone());
        } else if (e.key === 'soundProfile') {
          cachedProfileId = secureStorage.getItem<SoundProfileId>('soundProfile', 'cherry-mx-blue');
          warmupProfile(cachedProfileId);
        } else if (e.key === 'soundVolume') {
          cachedSoundVolume = secureStorage.getItem<number>('soundVolume', 70);
          if (masterGain && audioCtx) {
            const vol = Math.max(0, Math.min(cachedSoundVolume, 100)) / 100;
            masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
          }
        }
      } catch {
        // ignore
      }
    });
  }
}

// Warm up cached settings immediately on script evaluation
if (typeof window !== 'undefined') {
  initCachedSettings();
}

/**
 * Updates in-memory sound settings immediately without waiting for storage events.
 */
export function updateSoundSettings(settings: {
  sound?: boolean;
  soundProfile?: SoundProfileId;
  soundVolume?: number;
}): void {
  if (settings.sound !== undefined) cachedSoundEnabled = settings.sound;
  if (settings.soundProfile !== undefined) {
    cachedProfileId = settings.soundProfile;
    warmupProfile(settings.soundProfile);
  }
  if (settings.soundVolume !== undefined) {
    cachedSoundVolume = settings.soundVolume;
    if (masterGain && audioCtx) {
      const vol = Math.max(0, Math.min(settings.soundVolume, 100)) / 100;
      masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    }
  }
}

/**
 * Lightweight fail-safe synthesis if buffer is still pre-rendering in first 2ms.
 */
function fallbackSynthesize(
  ctx: AudioContext,
  master: GainNode,
  profileId: SoundProfileId,
  type: 'correct' | 'error',
  isSpace: boolean
): void {
  try {
    const config = PROFILE_CONFIGS[profileId];
    if (!config) return;
    const layerConfig = type === 'correct' ? config.keydown : config.error;
    const now = ctx.currentTime;
    const pitchMult = isSpace ? 0.82 : 1.0;
    const durMult = isSpace ? 1.20 : 1.0;

    for (const osc of layerConfig.oscillators) {
      const node = ctx.createOscillator();
      const gain = ctx.createGain();
      const dur = osc.duration * durMult;

      node.type = osc.type;
      node.frequency.setValueAtTime(osc.freq * pitchMult, now);
      if (osc.freqEnd) {
        node.frequency.exponentialRampToValueAtTime(Math.max(osc.freqEnd * pitchMult, 20), now + dur);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(osc.gain, now + osc.attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + osc.attack + osc.decay);

      node.connect(gain);
      gain.connect(master);

      node.start(now);
      node.stop(now + dur + 0.02);

      node.onended = () => {
        try {
          node.disconnect();
          gain.disconnect();
        } catch {}
      };
    }
  } catch {
    // ignore
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Play a keystroke sound with zero latency, zero node leaks, and zero sound cuts.
 * Uses pre-rendered PCM AudioBuffers directly connected to the master gain.
 */
export function playKeystrokeSound(type: 'correct' | 'error', char?: string): void {
  if (typeof window === 'undefined') return;

  if (!settingsInitialized) {
    initCachedSettings();
  }

  if (!cachedSoundEnabled) return;

  const volumeMultiplier = Math.max(0, Math.min(cachedSoundVolume, 100)) / 100;
  if (volumeMultiplier <= 0) return;

  const audio = ensureAudioContext();
  if (!audio) return;
  const { ctx, master } = audio;

  // Sync master volume
  master.gain.setValueAtTime(volumeMultiplier, ctx.currentTime);

  const isSpace = char === ' ';
  const profileBuffers = profileBufferCache.get(cachedProfileId);

  if (profileBuffers) {
    let buffer: AudioBuffer;
    if (type === 'error') {
      buffer = profileBuffers.error;
    } else if (isSpace) {
      buffer = profileBuffers.space;
    } else {
      buffer = profileBuffers.keydown[variationIndex % profileBuffers.keydown.length];
      variationIndex++;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Organic micro-pitch variance (±1.5%) for authentic mechanical feel
    if (type === 'correct' && !isSpace) {
      source.playbackRate.value = 0.985 + Math.random() * 0.03;
    }

    source.connect(master);
    // 0 specifies the earliest possible hardware audio quantum for true zero-latency response
    source.start(0);
    return;
  }

  // Instant fallback for the first 2ms while buffer completes
  fallbackSynthesize(ctx, master, cachedProfileId, type, isSpace);
  warmupProfile(cachedProfileId);
}

/**
 * Play a preview sound for a specific profile (used in Settings UI).
 * Ignores the sound-enabled toggle so the user can always preview.
 */
export function previewProfileSound(profileId: SoundProfileId): void {
  if (typeof window === 'undefined') return;

  if (!settingsInitialized) {
    initCachedSettings();
  }

  const audio = ensureAudioContext();
  if (!audio) return;
  const { ctx } = audio;

  const volumeMultiplier = Math.max(Math.max(0, Math.min(cachedSoundVolume, 100)) / 100, 0.35);

  const profileBuffers = profileBufferCache.get(profileId);
  if (profileBuffers) {
    const source = ctx.createBufferSource();
    source.buffer = profileBuffers.keydown[0];

    const previewGain = ctx.createGain();
    previewGain.gain.setValueAtTime(volumeMultiplier, ctx.currentTime);
    previewGain.connect(ctx.destination);

    source.connect(previewGain);
    source.start(0);

    source.onended = () => {
      try {
        source.disconnect();
        previewGain.disconnect();
      } catch {}
    };
    return;
  }

  warmupProfile(profileId);
  const sampleRate = ctx.sampleRate || 44100;
  renderSoundProfileToBuffers(profileId, sampleRate).then((bufs) => {
    if (!bufs) return;
    const source = ctx.createBufferSource();
    source.buffer = bufs.keydown[0];

    const previewGain = ctx.createGain();
    previewGain.gain.setValueAtTime(volumeMultiplier, ctx.currentTime);
    previewGain.connect(ctx.destination);

    source.connect(previewGain);
    source.start(0);

    source.onended = () => {
      try {
        source.disconnect();
        previewGain.disconnect();
      } catch {}
    };
  });
}

