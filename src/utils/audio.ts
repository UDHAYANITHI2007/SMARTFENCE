/**
 * SmartFence Acoustic Feedback Synthesizer
 * Uses Web Audio API for relay click, pulse tick, and emergency siren alarm.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let alarmOscillator: OscillatorNode | null = null;
let alarmGain: GainNode | null = null;

export function setAudioEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled && !audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

export function playRelayCutoffSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore audio restrictions
  }
}

export function playEmergencyAlarmBeep() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(660, now + 0.08);
    osc.frequency.setValueAtTime(880, now + 0.16);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Ignore
  }
}
