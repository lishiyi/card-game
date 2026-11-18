/**
 * Zero-dependency procedural Web Audio sound synthesizer for card plays, hits, shields, relics, and UI feedback.
 */

export function createSoundEngine(getSettings) {
  let ctx = null;
  let noiseBuffer = null;

  function ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try {
        ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function getMasterGainValue() {
    const settings = getSettings ? getSettings() : null;
    if (!settings || !settings.soundEnabled) return 0;
    const vol = Math.max(0, Math.min(100, settings.volume ?? 65));
    return (vol / 100) * 0.28;
  }

  function getNoiseBuffer(audioCtx) {
    if (noiseBuffer) return noiseBuffer;
    const length = Math.floor(audioCtx.sampleRate * 0.25);
    const buf = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buf;
    return buf;
  }

  function playTone(audioCtx, { type = 'triangle', freq = 320, endFreq = null, start = 0, duration = 0.12, gain = 0.15 }) {
    const now = audioCtx.currentTime + start;
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }
    amp.gain.setValueAtTime(Math.max(0.0001, gain), now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp);
    amp.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoiseBurst(audioCtx, { start = 0, duration = 0.12, filterFreq = 1200, filterType = 'bandpass', gain = 0.15 }) {
    const now = audioCtx.currentTime + start;
    const src = audioCtx.createBufferSource();
    src.buffer = getNoiseBuffer(audioCtx);
    const filter = audioCtx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, now);
    const amp = audioCtx.createGain();
    amp.gain.setValueAtTime(Math.max(0.0001, gain), now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(audioCtx.destination);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  function play(cue) {
    const baseGain = getMasterGainValue();
    if (baseGain <= 0.0005) return;
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      switch (cue) {
        case 'ui_click':
          playTone(audioCtx, { type: 'triangle', freq: 520, endFreq: 340, duration: 0.05, gain: baseGain * 0.55 });
          break;
        case 'card_attack':
          playNoiseBurst(audioCtx, { duration: 0.09, filterFreq: 1800, gain: baseGain * 0.8 });
          playTone(audioCtx, { type: 'sawtooth', freq: 290, endFreq: 95, duration: 0.13, gain: baseGain * 0.85 });
          break;
        case 'card_skill':
          playTone(audioCtx, { type: 'sine', freq: 392, endFreq: 523.25, duration: 0.12, gain: baseGain * 0.75 });
          playTone(audioCtx, { type: 'triangle', freq: 587.33, start: 0.04, duration: 0.11, gain: baseGain * 0.55 });
          break;
        case 'card_power':
          playTone(audioCtx, { type: 'triangle', freq: 261.63, duration: 0.22, gain: baseGain * 0.7 });
          playTone(audioCtx, { type: 'triangle', freq: 329.63, start: 0.05, duration: 0.22, gain: baseGain * 0.7 });
          playTone(audioCtx, { type: 'sine', freq: 523.25, start: 0.1, duration: 0.26, gain: baseGain * 0.8 });
          break;
        case 'hit':
          playTone(audioCtx, { type: 'square', freq: 155, endFreq: 48, duration: 0.14, gain: baseGain * 0.95 });
          playNoiseBurst(audioCtx, { duration: 0.08, filterFreq: 720, filterType: 'lowpass', gain: baseGain * 0.85 });
          break;
        case 'block':
          playTone(audioCtx, { type: 'triangle', freq: 660, endFreq: 440, duration: 0.11, gain: baseGain * 0.7 });
          playTone(audioCtx, { type: 'sine', freq: 880, start: 0.03, duration: 0.09, gain: baseGain * 0.5 });
          break;
        case 'shield_break':
          playNoiseBurst(audioCtx, { duration: 0.2, filterFreq: 2400, filterType: 'highpass', gain: baseGain * 1.05 });
          playTone(audioCtx, { type: 'sawtooth', freq: 620, endFreq: 130, duration: 0.2, gain: baseGain * 0.85 });
          break;
        case 'heal':
          playTone(audioCtx, { type: 'sine', freq: 440, duration: 0.12, gain: baseGain * 0.65 });
          playTone(audioCtx, { type: 'sine', freq: 554.37, start: 0.07, duration: 0.14, gain: baseGain * 0.65 });
          playTone(audioCtx, { type: 'sine', freq: 659.25, start: 0.14, duration: 0.18, gain: baseGain * 0.75 });
          break;
        case 'potion':
          playTone(audioCtx, { type: 'sine', freq: 360, endFreq: 760, duration: 0.14, gain: baseGain * 0.75 });
          playTone(audioCtx, { type: 'triangle', freq: 880, start: 0.09, duration: 0.12, gain: baseGain * 0.55 });
          break;
        case 'gold':
          playTone(audioCtx, { type: 'sine', freq: 1046.5, duration: 0.09, gain: baseGain * 0.65 });
          playTone(audioCtx, { type: 'sine', freq: 1318.5, start: 0.06, duration: 0.14, gain: baseGain * 0.7 });
          break;
        case 'upgrade':
          playNoiseBurst(audioCtx, { duration: 0.06, filterFreq: 3000, gain: baseGain * 0.75 });
          playTone(audioCtx, { type: 'triangle', freq: 587.33, duration: 0.16, gain: baseGain * 0.85 });
          playTone(audioCtx, { type: 'sine', freq: 1174.66, start: 0.03, duration: 0.24, gain: baseGain * 0.7 });
          break;
        case 'victory':
          playTone(audioCtx, { type: 'triangle', freq: 392.0, duration: 0.14, gain: baseGain * 0.75 });
          playTone(audioCtx, { type: 'triangle', freq: 493.88, start: 0.1, duration: 0.14, gain: baseGain * 0.75 });
          playTone(audioCtx, { type: 'triangle', freq: 587.33, start: 0.2, duration: 0.16, gain: baseGain * 0.8 });
          playTone(audioCtx, { type: 'triangle', freq: 783.99, start: 0.32, duration: 0.32, gain: baseGain * 0.9 });
          break;
        case 'defeat':
          playTone(audioCtx, { type: 'sawtooth', freq: 246.94, endFreq: 196.0, duration: 0.24, gain: baseGain * 0.65 });
          playTone(audioCtx, { type: 'sawtooth', freq: 185.0, endFreq: 110.0, start: 0.2, duration: 0.42, gain: baseGain * 0.75 });
          break;
        case 'test':
          playTone(audioCtx, { type: 'triangle', freq: 523.25, duration: 0.12, gain: baseGain * 0.85 });
          playTone(audioCtx, { type: 'sine', freq: 659.25, start: 0.1, duration: 0.18, gain: baseGain * 0.85 });
          break;
        default:
          break;
      }
    } catch {
      // Never allow audio failures to interrupt gameplay
    }
  }

  return { play };
}
