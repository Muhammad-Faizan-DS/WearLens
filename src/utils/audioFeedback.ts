// Native Web Audio API sound designer for ultra-premium Awwwards/Astra micro-interactions
let audioCtx: AudioContext | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isMuted = true;

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

export function playMicroClick(frequency = 1200, duration = 0.035, type: OscillatorType = 'sine') {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.debug('Audio feedback suppressed:', e);
  }
}

export function playShutterSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.08);
  } catch (e) {
    console.debug('Audio feedback suppressed:', e);
  }
}

export function toggleAmbientSoundscape(active: boolean) {
  isMuted = !active;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (active) {
    if (!ambientOsc) {
      try {
        ambientOsc = ctx.createOscillator();
        ambientGain = ctx.createGain();

        // 432Hz harmonic studio drone with ultra-low volume
        ambientOsc.type = 'sine';
        ambientOsc.frequency.setValueAtTime(108, ctx.currentTime);

        ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1.2);

        ambientOsc.connect(ambientGain);
        ambientGain.connect(ctx.destination);
        ambientOsc.start();
      } catch (e) {
        console.debug('Ambient audio suppressed:', e);
      }
    } else if (ambientGain) {
      ambientGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.5);
    }
  } else {
    if (ambientGain && ctx) {
      ambientGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
  }
}

export function isAudioActive(): boolean {
  return !isMuted;
}
