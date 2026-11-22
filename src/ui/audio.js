/**
 * Zero-dependency procedural Web Audio sound synthesizer for card plays, hits, shields,
 * stances, poison, shivs, anvil smithing, relics, and Spire acoustic reverb.
 */

export const AUDIO_CUES = Object.freeze([
  'ui_click',
  'card_select',
  'card_draw',
  'card_shuffle',
  'card_attack',
  'card_skill',
  'card_power',
  'hit',
  'hit_heavy',
  'hit_multi',
  'enemy_kill',
  'shiv',
  'poison',
  'exhaust',
  'block',
  'shield_break',
  'buff',
  'debuff',
  'stance_calm',
  'stance_wrath',
  'stance_divinity',
  'heal',
  'potion',
  'gold',
  'upgrade',
  'smith',
  'dig',
  'chest_open',
  'curse',
  'end_turn',
  'boss_intro',
  'error',
  'victory',
  'defeat',
  'test',
]);

export function createSoundEngine(getSettings) {
  let ctx = null;
  let noiseBuffer = null;
  let dryBus = null;
  let wetBus = null;
  let lastCue = null;
  const recentCues = [];

  function setupAudioGraph(audioCtx) {
    if (dryBus) return;
    try {
      const masterIn = audioCtx.createGain();
      masterIn.gain.value = 1;

      let finalNode = audioCtx.destination;
      if (typeof audioCtx.createDynamicsCompressor === 'function') {
        const comp = audioCtx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.knee.value = 18;
        comp.ratio.value = 6;
        comp.attack.value = 0.003;
        comp.release.value = 0.14;
        comp.connect(audioCtx.destination);
        finalNode = comp;
      }

      masterIn.connect(finalNode);
      dryBus = masterIn;

      // Lightweight algorithmic stone-hall two-tap reverb send for Spire depth
      if (
        typeof audioCtx.createDelay === 'function' &&
        typeof audioCtx.createBiquadFilter === 'function'
      ) {
        const send = audioCtx.createGain();
        send.gain.value = 1;

        const d1 = audioCtx.createDelay(0.2);
        d1.delayTime.value = 0.031;
        const d2 = audioCtx.createDelay(0.2);
        d2.delayTime.value = 0.049;

        const damp = audioCtx.createBiquadFilter();
        damp.type = 'lowpass';
        damp.frequency.value = 2500;

        const fb1 = audioCtx.createGain();
        fb1.gain.value = 0.24;
        const fb2 = audioCtx.createGain();
        fb2.gain.value = 0.2;

        const wetReturn = audioCtx.createGain();
        wetReturn.gain.value = 0.28;

        send.connect(d1);
        send.connect(d2);
        d1.connect(damp);
        d2.connect(damp);
        damp.connect(wetReturn);
        wetReturn.connect(finalNode);

        // Cross-feedback loop for smooth hall tail
        damp.connect(fb1);
        fb1.connect(d2);
        damp.connect(fb2);
        fb2.connect(d1);

        wetBus = send;
      } else {
        wetBus = dryBus;
      }
    } catch {
      dryBus = audioCtx.destination;
      wetBus = audioCtx.destination;
    }
  }

  function ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try {
        ctx = new AudioCtx();
        setupAudioGraph(ctx);
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
    const length = Math.floor(audioCtx.sampleRate * 0.65);
    const buf = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buf;
    return buf;
  }

  function jitter(freq, spread = 0.045) {
    return freq * (1 + (Math.random() * 2 - 1) * spread);
  }

  function routeOutput(audioCtx, node, reverb = 0.14) {
    const targetDry = dryBus || audioCtx.destination;
    node.connect(targetDry);
    if (reverb > 0.01 && wetBus && wetBus !== targetDry) {
      const sendGain = audioCtx.createGain();
      sendGain.gain.value = Math.min(0.85, reverb);
      node.connect(sendGain);
      sendGain.connect(wetBus);
    }
  }

  function applyEnvelope(amp, now, gain, attack, duration) {
    const peak = Math.max(0.0002, gain);
    const atk = Math.min(attack, duration * 0.45);
    if (atk > 0.001) {
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.linearRampToValueAtTime(peak, now + atk);
    } else {
      amp.gain.setValueAtTime(peak, now);
    }
    amp.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.015, duration));
  }

  function playTone(
    audioCtx,
    {
      type = 'triangle',
      freq = 320,
      endFreq = null,
      start = 0,
      attack = 0.004,
      duration = 0.12,
      gain = 0.15,
      filterFreq = null,
      filterType = 'lowpass',
      reverb = 0.14,
    }
  ) {
    const now = audioCtx.currentTime + start;
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), now);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }
    applyEnvelope(amp, now, gain, attack, duration);

    let chain = osc;
    if (filterFreq !== null && typeof audioCtx.createBiquadFilter === 'function') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, now);
      chain.connect(filter);
      chain = filter;
    }
    chain.connect(amp);
    routeOutput(audioCtx, amp, reverb);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  function playFmTone(
    audioCtx,
    {
      carrierFreq = 880,
      modFreq = 1320,
      modDepth = 260,
      start = 0,
      attack = 0.002,
      duration = 0.18,
      gain = 0.14,
      reverb = 0.24,
    }
  ) {
    const now = audioCtx.currentTime + start;
    const carrier = audioCtx.createOscillator();
    const mod = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const amp = audioCtx.createGain();

    carrier.type = 'sine';
    mod.type = 'sine';
    carrier.frequency.setValueAtTime(Math.max(20, carrierFreq), now);
    mod.frequency.setValueAtTime(Math.max(20, modFreq), now);
    modGain.gain.setValueAtTime(Math.max(1, modDepth), now);
    modGain.gain.exponentialRampToValueAtTime(0.5, now + duration);

    applyEnvelope(amp, now, gain, attack, duration);

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(amp);
    routeOutput(audioCtx, amp, reverb);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + duration + 0.03);
    mod.stop(now + duration + 0.03);
  }

  function playNoiseBurst(
    audioCtx,
    {
      start = 0,
      attack = 0.003,
      duration = 0.12,
      filterFreq = 1200,
      endFilterFreq = null,
      filterType = 'bandpass',
      q = 1.2,
      gain = 0.15,
      reverb = 0.12,
    }
  ) {
    const now = audioCtx.currentTime + start;
    const src = audioCtx.createBufferSource();
    src.buffer = getNoiseBuffer(audioCtx);
    const filter = audioCtx.createBiquadFilter();
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(Math.max(40, filterFreq), now);
    if (endFilterFreq !== null) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFilterFreq), now + duration);
    }
    const amp = audioCtx.createGain();
    applyEnvelope(amp, now, gain, attack, duration);
    src.connect(filter);
    filter.connect(amp);
    routeOutput(audioCtx, amp, reverb);
    src.start(now);
    src.stop(now + duration + 0.03);
  }

  function play(cue, opts = {}) {
    const baseGain = getMasterGainValue();
    if (baseGain <= 0.0005) return;
    lastCue = cue;
    recentCues.push(cue);
    if (recentCues.length > 24) recentCues.shift();
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      switch (cue) {
        case 'ui_click': {
          const f = jitter(540, 0.04);
          playTone(audioCtx, {
            type: 'triangle',
            freq: f,
            endFreq: f * 0.64,
            duration: 0.048,
            attack: 0.002,
            gain: baseGain * 0.48,
            filterFreq: 1800,
            reverb: 0.05,
          });
          playNoiseBurst(audioCtx, {
            duration: 0.022,
            filterFreq: 2400,
            filterType: 'bandpass',
            q: 2.2,
            gain: baseGain * 0.22,
            reverb: 0.04,
          });
          break;
        }
        case 'card_select': {
          const f = jitter(640, 0.05);
          playNoiseBurst(audioCtx, {
            duration: 0.045,
            filterFreq: 1600,
            endFilterFreq: 3400,
            filterType: 'bandpass',
            q: 1.8,
            gain: baseGain * 0.42,
            reverb: 0.06,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: f,
            endFreq: f * 1.24,
            duration: 0.055,
            attack: 0.002,
            gain: baseGain * 0.45,
            reverb: 0.06,
          });
          break;
        }
        case 'card_draw': {
          playNoiseBurst(audioCtx, {
            duration: 0.085,
            attack: 0.01,
            filterFreq: 1100,
            endFilterFreq: 2900,
            filterType: 'bandpass',
            q: 1.6,
            gain: baseGain * 0.55,
            reverb: 0.08,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: jitter(420, 0.06),
            endFreq: 560,
            duration: 0.06,
            gain: baseGain * 0.22,
            reverb: 0.06,
          });
          break;
        }
        case 'card_shuffle': {
          for (let i = 0; i < 4; i += 1) {
            playNoiseBurst(audioCtx, {
              start: i * 0.042,
              duration: 0.048,
              filterFreq: 1400 + i * 260,
              endFilterFreq: 2600 + i * 240,
              filterType: 'bandpass',
              q: 1.8,
              gain: baseGain * 0.42,
              reverb: 0.08,
            });
          }
          break;
        }
        case 'card_attack': {
          const f = jitter(310, 0.06);
          playNoiseBurst(audioCtx, {
            duration: 0.095,
            filterFreq: 2600,
            endFilterFreq: 900,
            filterType: 'bandpass',
            q: 1.4,
            gain: baseGain * 0.85,
            reverb: 0.14,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: f,
            endFreq: f * 0.3,
            duration: 0.13,
            attack: 0.003,
            filterFreq: 1600,
            gain: baseGain * 0.78,
            reverb: 0.14,
          });
          break;
        }
        case 'card_skill': {
          const base = jitter(440, 0.03);
          playNoiseBurst(audioCtx, {
            duration: 0.06,
            filterFreq: 1900,
            endFilterFreq: 3200,
            gain: baseGain * 0.28,
            reverb: 0.1,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: base,
            endFreq: base * 1.25,
            duration: 0.12,
            gain: baseGain * 0.65,
            reverb: 0.18,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: base * 1.5,
            start: 0.04,
            duration: 0.13,
            gain: baseGain * 0.48,
            reverb: 0.2,
          });
          break;
        }
        case 'card_power': {
          playTone(audioCtx, {
            type: 'triangle',
            freq: 220,
            duration: 0.28,
            attack: 0.015,
            gain: baseGain * 0.68,
            filterFreq: 1400,
            reverb: 0.32,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 329.63,
            start: 0.055,
            duration: 0.28,
            attack: 0.012,
            gain: baseGain * 0.65,
            reverb: 0.32,
          });
          playFmTone(audioCtx, {
            carrierFreq: 523.25,
            modFreq: 1046.5,
            modDepth: 180,
            start: 0.11,
            duration: 0.36,
            gain: baseGain * 0.65,
            reverb: 0.38,
          });
          break;
        }
        case 'hit': {
          const f = jitter(162, 0.06);
          playTone(audioCtx, {
            type: 'sine',
            freq: f,
            endFreq: 44,
            duration: 0.14,
            attack: 0.002,
            gain: baseGain * 1.05,
            reverb: 0.14,
          });
          playTone(audioCtx, {
            type: 'square',
            freq: f * 0.9,
            endFreq: 52,
            duration: 0.09,
            attack: 0.002,
            filterFreq: 520,
            gain: baseGain * 0.55,
            reverb: 0.1,
          });
          playNoiseBurst(audioCtx, {
            duration: 0.085,
            filterFreq: 860,
            endFilterFreq: 240,
            filterType: 'lowpass',
            gain: baseGain * 0.85,
            reverb: 0.14,
          });
          break;
        }
        case 'hit_heavy': {
          const f = jitter(128, 0.05);
          // Seismic sub-bass body slam + metallic crunch + spire hall decay
          playTone(audioCtx, {
            type: 'sine',
            freq: f,
            endFreq: 32,
            duration: 0.26,
            attack: 0.002,
            gain: baseGain * 1.25,
            reverb: 0.28,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: f * 1.65,
            endFreq: 46,
            duration: 0.2,
            attack: 0.002,
            filterFreq: 760,
            gain: baseGain * 0.85,
            reverb: 0.24,
          });
          playNoiseBurst(audioCtx, {
            duration: 0.16,
            filterFreq: 1450,
            endFilterFreq: 220,
            filterType: 'lowpass',
            gain: baseGain * 1.05,
            reverb: 0.28,
          });
          playFmTone(audioCtx, {
            carrierFreq: jitter(420, 0.06),
            modFreq: 690,
            modDepth: 340,
            start: 0.01,
            duration: 0.16,
            gain: baseGain * 0.52,
            reverb: 0.26,
          });
          break;
        }
        case 'hit_multi': {
          const count = Math.max(2, Math.min(4, opts.hits || 2));
          for (let i = 0; i < count; i += 1) {
            const delay = i * 0.065;
            const pitch = jitter(185 + i * 28, 0.05);
            playTone(audioCtx, {
              type: 'sine',
              freq: pitch,
              endFreq: 52,
              start: delay,
              duration: 0.095,
              attack: 0.002,
              gain: baseGain * 0.88,
              reverb: 0.12,
            });
            playNoiseBurst(audioCtx, {
              start: delay,
              duration: 0.055,
              filterFreq: 1650 + i * 220,
              endFilterFreq: 520,
              filterType: 'bandpass',
              gain: baseGain * 0.72,
              reverb: 0.12,
            });
          }
          break;
        }
        case 'enemy_kill': {
          playTone(audioCtx, {
            type: 'sine',
            freq: 145,
            endFreq: 34,
            duration: 0.28,
            attack: 0.002,
            gain: baseGain * 1.15,
            reverb: 0.3,
          });
          playNoiseBurst(audioCtx, {
            duration: 0.22,
            filterFreq: 1800,
            endFilterFreq: 190,
            filterType: 'lowpass',
            gain: baseGain * 0.95,
            reverb: 0.3,
          });
          playFmTone(audioCtx, {
            carrierFreq: 660,
            modFreq: 990,
            modDepth: 210,
            start: 0.05,
            duration: 0.28,
            gain: baseGain * 0.55,
            reverb: 0.34,
          });
          break;
        }
        case 'shiv': {
          const f = jitter(2150, 0.06);
          playNoiseBurst(audioCtx, {
            duration: 0.065,
            filterFreq: 4400,
            endFilterFreq: 1400,
            filterType: 'bandpass',
            q: 2.0,
            gain: baseGain * 0.78,
            reverb: 0.16,
          });
          playFmTone(audioCtx, {
            carrierFreq: f,
            modFreq: f * 1.48,
            modDepth: 620,
            duration: 0.095,
            attack: 0.001,
            gain: baseGain * 0.62,
            reverb: 0.2,
          });
          break;
        }
        case 'poison': {
          playNoiseBurst(audioCtx, {
            duration: 0.18,
            attack: 0.015,
            filterFreq: 2600,
            endFilterFreq: 1100,
            filterType: 'bandpass',
            q: 2.4,
            gain: baseGain * 0.6,
            reverb: 0.18,
          });
          const bubbles = [
            { t: 0.01, f1: 390, f2: 690 },
            { t: 0.07, f1: 490, f2: 860 },
            { t: 0.13, f1: 360, f2: 620 },
          ];
          for (const b of bubbles) {
            playTone(audioCtx, {
              type: 'sine',
              freq: jitter(b.f1, 0.06),
              endFreq: b.f2,
              start: b.t,
              duration: 0.065,
              attack: 0.004,
              gain: baseGain * 0.52,
              reverb: 0.16,
            });
          }
          break;
        }
        case 'exhaust': {
          playNoiseBurst(audioCtx, {
            duration: 0.24,
            attack: 0.018,
            filterFreq: 2100,
            endFilterFreq: 310,
            filterType: 'bandpass',
            q: 1.5,
            gain: baseGain * 0.78,
            reverb: 0.28,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 290,
            endFreq: 92,
            duration: 0.22,
            attack: 0.01,
            filterFreq: 900,
            gain: baseGain * 0.55,
            reverb: 0.26,
          });
          break;
        }
        case 'block': {
          const f = jitter(640, 0.04);
          playFmTone(audioCtx, {
            carrierFreq: f,
            modFreq: f * 1.41,
            modDepth: 320,
            duration: 0.13,
            attack: 0.002,
            gain: baseGain * 0.65,
            reverb: 0.22,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: f * 0.5,
            endFreq: f * 0.38,
            duration: 0.11,
            attack: 0.002,
            gain: baseGain * 0.58,
            reverb: 0.16,
          });
          break;
        }
        case 'shield_break': {
          playNoiseBurst(audioCtx, {
            duration: 0.22,
            filterFreq: 2800,
            endFilterFreq: 900,
            filterType: 'highpass',
            gain: baseGain * 1.0,
            reverb: 0.26,
          });
          playFmTone(audioCtx, {
            carrierFreq: 740,
            modFreq: 1180,
            modDepth: 540,
            duration: 0.19,
            gain: baseGain * 0.72,
            reverb: 0.26,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 520,
            endFreq: 115,
            start: 0.03,
            duration: 0.2,
            filterFreq: 1500,
            gain: baseGain * 0.68,
            reverb: 0.22,
          });
          break;
        }
        case 'buff': {
          playTone(audioCtx, {
            type: 'triangle',
            freq: 440,
            endFreq: 523.25,
            duration: 0.14,
            attack: 0.008,
            gain: baseGain * 0.58,
            reverb: 0.24,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 659.25,
            endFreq: 783.99,
            start: 0.06,
            duration: 0.18,
            attack: 0.008,
            gain: baseGain * 0.6,
            reverb: 0.28,
          });
          break;
        }
        case 'debuff': {
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 369.99,
            endFreq: 261.63,
            duration: 0.18,
            attack: 0.008,
            filterFreq: 950,
            gain: baseGain * 0.52,
            reverb: 0.22,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 246.94,
            endFreq: 185.0,
            start: 0.07,
            duration: 0.2,
            gain: baseGain * 0.55,
            reverb: 0.24,
          });
          break;
        }
        case 'stance_calm': {
          // Serene singing-bowl crystal chime
          playFmTone(audioCtx, {
            carrierFreq: 523.25,
            modFreq: 1046.5,
            modDepth: 110,
            duration: 0.38,
            attack: 0.015,
            gain: baseGain * 0.65,
            reverb: 0.42,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 783.99,
            start: 0.05,
            duration: 0.36,
            attack: 0.018,
            gain: baseGain * 0.52,
            reverb: 0.44,
          });
          break;
        }
        case 'stance_wrath': {
          // Igniting crimson flame surge
          playNoiseBurst(audioCtx, {
            duration: 0.24,
            attack: 0.012,
            filterFreq: 680,
            endFilterFreq: 2400,
            filterType: 'bandpass',
            q: 1.3,
            gain: baseGain * 0.88,
            reverb: 0.28,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 164.81,
            endFreq: 329.63,
            duration: 0.22,
            attack: 0.008,
            filterFreq: 1350,
            gain: baseGain * 0.82,
            reverb: 0.28,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 110,
            endFreq: 146.83,
            duration: 0.24,
            gain: baseGain * 0.72,
            reverb: 0.26,
          });
          break;
        }
        case 'stance_divinity': {
          // Celestial cathedral chord swell
          const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
          notes.forEach((n, idx) => {
            playFmTone(audioCtx, {
              carrierFreq: n,
              modFreq: n * 2,
              modDepth: 120,
              start: idx * 0.04,
              attack: 0.014,
              duration: 0.45,
              gain: baseGain * (0.48 + idx * 0.04),
              reverb: 0.48,
            });
          });
          break;
        }
        case 'heal': {
          const notes = [440, 554.37, 659.25, 880];
          notes.forEach((n, idx) => {
            playTone(audioCtx, {
              type: 'sine',
              freq: n,
              start: idx * 0.06,
              attack: 0.01,
              duration: 0.2,
              gain: baseGain * (0.58 + idx * 0.04),
              reverb: 0.3,
            });
          });
          break;
        }
        case 'potion': {
          playFmTone(audioCtx, {
            carrierFreq: 1480,
            modFreq: 2220,
            modDepth: 200,
            duration: 0.075,
            gain: baseGain * 0.42,
            reverb: 0.2,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 340,
            endFreq: 760,
            start: 0.03,
            duration: 0.14,
            attack: 0.008,
            gain: baseGain * 0.7,
            reverb: 0.22,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 520,
            endFreq: 980,
            start: 0.11,
            duration: 0.13,
            attack: 0.006,
            gain: baseGain * 0.58,
            reverb: 0.24,
          });
          break;
        }
        case 'gold': {
          const coins = [1567.98, 2093.0, 2637.02];
          coins.forEach((freq, idx) => {
            playFmTone(audioCtx, {
              carrierFreq: jitter(freq, 0.02),
              modFreq: freq * 1.5,
              modDepth: 260,
              start: idx * 0.052,
              duration: 0.14,
              gain: baseGain * (0.54 + idx * 0.05),
              reverb: 0.28,
            });
          });
          break;
        }
        case 'upgrade': {
          playNoiseBurst(audioCtx, {
            duration: 0.065,
            filterFreq: 3200,
            filterType: 'highpass',
            gain: baseGain * 0.52,
            reverb: 0.24,
          });
          playFmTone(audioCtx, {
            carrierFreq: 587.33,
            modFreq: 1174.66,
            modDepth: 240,
            duration: 0.22,
            gain: baseGain * 0.72,
            reverb: 0.34,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 1174.66,
            start: 0.055,
            duration: 0.28,
            attack: 0.006,
            gain: baseGain * 0.68,
            reverb: 0.36,
          });
          break;
        }
        case 'smith': {
          // Authentic blacksmith hammer-on-anvil ring + forge hiss
          playNoiseBurst(audioCtx, {
            duration: 0.05,
            filterFreq: 3800,
            filterType: 'highpass',
            gain: baseGain * 0.8,
            reverb: 0.24,
          });
          playFmTone(audioCtx, {
            carrierFreq: 987.77,
            modFreq: 2469.42,
            modDepth: 680,
            duration: 0.38,
            attack: 0.001,
            gain: baseGain * 0.85,
            reverb: 0.42,
          });
          playFmTone(audioCtx, {
            carrierFreq: 1479.98,
            modFreq: 2959.96,
            modDepth: 320,
            start: 0.02,
            duration: 0.34,
            attack: 0.002,
            gain: baseGain * 0.55,
            reverb: 0.42,
          });
          playNoiseBurst(audioCtx, {
            start: 0.07,
            duration: 0.2,
            filterFreq: 2400,
            endFilterFreq: 1100,
            filterType: 'bandpass',
            gain: baseGain * 0.38,
            reverb: 0.26,
          });
          break;
        }
        case 'dig': {
          // Earthy shovel plunge + metallic relic discovery glint
          playNoiseBurst(audioCtx, {
            duration: 0.14,
            filterFreq: 760,
            endFilterFreq: 320,
            filterType: 'lowpass',
            gain: baseGain * 0.9,
            reverb: 0.16,
          });
          playNoiseBurst(audioCtx, {
            start: 0.11,
            duration: 0.1,
            filterFreq: 1150,
            endFilterFreq: 520,
            filterType: 'bandpass',
            gain: baseGain * 0.62,
            reverb: 0.18,
          });
          playFmTone(audioCtx, {
            carrierFreq: 1318.51,
            modFreq: 1977.77,
            modDepth: 220,
            start: 0.17,
            duration: 0.22,
            gain: baseGain * 0.58,
            reverb: 0.32,
          });
          break;
        }
        case 'chest_open': {
          // Brass latch snap + wooden creak + golden treasure arpeggio
          playTone(audioCtx, {
            type: 'triangle',
            freq: 220,
            endFreq: 310,
            duration: 0.11,
            filterFreq: 900,
            gain: baseGain * 0.65,
            reverb: 0.22,
          });
          playFmTone(audioCtx, {
            carrierFreq: 1046.5,
            modFreq: 1567.98,
            modDepth: 260,
            start: 0.08,
            duration: 0.2,
            gain: baseGain * 0.65,
            reverb: 0.34,
          });
          playFmTone(audioCtx, {
            carrierFreq: 1567.98,
            modFreq: 2351.97,
            modDepth: 220,
            start: 0.16,
            duration: 0.28,
            gain: baseGain * 0.72,
            reverb: 0.38,
          });
          break;
        }
        case 'curse': {
          // Ominous dark spire bell toll
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 138.59,
            endFreq: 110.0,
            duration: 0.42,
            attack: 0.015,
            filterFreq: 540,
            gain: baseGain * 0.7,
            reverb: 0.38,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 146.83,
            endFreq: 116.54,
            start: 0.02,
            duration: 0.44,
            attack: 0.015,
            filterFreq: 680,
            gain: baseGain * 0.62,
            reverb: 0.4,
          });
          break;
        }
        case 'end_turn': {
          playTone(audioCtx, {
            type: 'triangle',
            freq: 360,
            endFreq: 210,
            duration: 0.09,
            attack: 0.002,
            filterFreq: 1200,
            gain: baseGain * 0.62,
            reverb: 0.14,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 260,
            endFreq: 170,
            start: 0.055,
            duration: 0.095,
            gain: baseGain * 0.5,
            reverb: 0.14,
          });
          break;
        }
        case 'boss_intro': {
          // Deep Spire war-horn + resonant war drum
          playTone(audioCtx, {
            type: 'sine',
            freq: 110,
            endFreq: 42,
            duration: 0.34,
            attack: 0.004,
            gain: baseGain * 1.05,
            reverb: 0.36,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 98.0,
            endFreq: 95.5,
            start: 0.04,
            attack: 0.04,
            duration: 0.56,
            filterFreq: 620,
            gain: baseGain * 0.72,
            reverb: 0.44,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 146.83,
            endFreq: 144.0,
            start: 0.08,
            attack: 0.045,
            duration: 0.52,
            filterFreq: 860,
            gain: baseGain * 0.55,
            reverb: 0.44,
          });
          break;
        }
        case 'error': {
          playTone(audioCtx, {
            type: 'square',
            freq: 180,
            endFreq: 145,
            duration: 0.065,
            attack: 0.002,
            filterFreq: 520,
            gain: baseGain * 0.48,
            reverb: 0.04,
          });
          playTone(audioCtx, {
            type: 'square',
            freq: 145,
            endFreq: 115,
            start: 0.07,
            duration: 0.085,
            attack: 0.002,
            filterFreq: 460,
            gain: baseGain * 0.48,
            reverb: 0.04,
          });
          break;
        }
        case 'victory': {
          const fanfare = [392.0, 493.88, 587.33, 783.99];
          fanfare.forEach((freq, idx) => {
            playTone(audioCtx, {
              type: 'triangle',
              freq,
              start: idx * 0.095,
              attack: 0.008,
              duration: idx === 3 ? 0.44 : 0.18,
              gain: baseGain * (0.72 + idx * 0.05),
              reverb: 0.38,
            });
          });
          playFmTone(audioCtx, {
            carrierFreq: 1567.98,
            modFreq: 3135.96,
            modDepth: 160,
            start: 0.29,
            duration: 0.42,
            gain: baseGain * 0.48,
            reverb: 0.44,
          });
          break;
        }
        case 'defeat': {
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 246.94,
            endFreq: 196.0,
            duration: 0.28,
            attack: 0.015,
            filterFreq: 880,
            gain: baseGain * 0.65,
            reverb: 0.34,
          });
          playTone(audioCtx, {
            type: 'sawtooth',
            freq: 185.0,
            endFreq: 110.0,
            start: 0.22,
            attack: 0.018,
            duration: 0.48,
            filterFreq: 680,
            gain: baseGain * 0.72,
            reverb: 0.4,
          });
          break;
        }
        case 'test': {
          playFmTone(audioCtx, {
            carrierFreq: 523.25,
            modFreq: 1046.5,
            modDepth: 140,
            duration: 0.16,
            gain: baseGain * 0.7,
            reverb: 0.3,
          });
          playTone(audioCtx, {
            type: 'sine',
            freq: 659.25,
            start: 0.09,
            duration: 0.2,
            gain: baseGain * 0.7,
            reverb: 0.32,
          });
          playTone(audioCtx, {
            type: 'triangle',
            freq: 783.99,
            start: 0.18,
            duration: 0.26,
            gain: baseGain * 0.74,
            reverb: 0.36,
          });
          break;
        }
        default:
          break;
      }
    } catch {
      // Never allow audio failures to interrupt gameplay
    }
  }

  return {
    play,
    cues: AUDIO_CUES,
    getLastCue: () => lastCue,
    getRecentCues: () => [...recentCues],
    clearRecentCues: () => {
      lastCue = null;
      recentCues.length = 0;
    },
  };
}
