/**
 * Web Audio API synthesizer for realistic camera shutter, countdown beeps,
 * and thermal receipt printing sounds without external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Beep for countdown (3, 2, 1) */
export function playCountdownBeep(isFinal = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 540, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.28 : 0.12));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (isFinal ? 0.3 : 0.15));
  } catch {
    // Ignore audio permission or context errors
  }
}

/** Mechanical camera shutter click */
export function playShutterSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // White noise click + low impulse
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();

    // Second mechanical click
    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

        g2.gain.setValueAtTime(0.2, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc.connect(g2);
        g2.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } catch {
        // Safe fail
      }
    }, 60);
  } catch {
    // Safe fail
  }
}

/** Authentic thermal receipt printer mechanical feed sound */
export function playThermalPrinterSound(durationMs = 1400): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const duration = durationMs / 1000;

    // Stepper motor tone pulsing
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, startTime);
    // Slight modulation for stepper jitter
    osc.frequency.linearRampToValueAtTime(240, startTime + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(210, startTime + duration);

    // Motor amplitude
    oscGain.gain.setValueAtTime(0.03, startTime);
    oscGain.gain.setValueAtTime(0.03, startTime + duration - 0.1);
    oscGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    // Thermal hiss noise
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1600, startTime);
    noiseFilter.Q.setValueAtTime(2.5, startTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
    noise.start(startTime);
    noise.stop(startTime + duration);
  } catch {
    // Safe fail
  }
}
