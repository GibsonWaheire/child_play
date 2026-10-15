import { useRef } from 'react';

// C major pentatonic across 3 octaves — always sounds musical no matter
// which key is smashed or how fast. Continuous smashing = ascending melody.
const PENTATONIC = [
  130.81, 146.83, 164.81, 196.00, 220.00,   // C3 D3 E3 G3 A3
  261.63, 293.66, 329.63, 392.00, 440.00,   // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.00,   // C5 D5 E5 G5 A5
];

// Celebration fanfare notes (C major)
const FANFARE = [523, 659, 784, 523, 659, 784, 1047];

export function useAudio() {
  const ctxRef       = useRef(null);
  const noteIndexRef = useRef(0);

  function getCtx() {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }

  // Advance through the pentatonic scale. Occasionally jump ±1 step for
  // slight unpredictability while keeping it musical.
  function nextFreq() {
    const len = PENTATONIC.length;
    const jump = Math.random() < 0.25
      ? (Math.random() > 0.5 ? 2 : -1)   // small leap
      : 1;                                  // normal step up
    noteIndexRef.current = ((noteIndexRef.current + jump) + len) % len;
    return PENTATONIC[noteIndexRef.current];
  }

  function playNote() {
    const audioCtx = getCtx();
    const freq = nextFreq();
    const now  = audioCtx.currentTime;

    // Marimba-like: quick attack, warm decay
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.01);   // quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.5);

    // Soft harmonic — adds warmth (triangle at 2x, very quiet)
    const osc2  = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2); gain2.connect(audioCtx.destination);
    osc2.start(now); osc2.stop(now + 0.3);
  }

  function playFireworks() {
    const audioCtx = getCtx();
    const now = audioCtx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, now + i * 0.09);
      g.gain.setValueAtTime(0.10, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(now + i * 0.09); o.stop(now + i * 0.09 + 0.4);
    });
  }

  function playCelebration() {
    const audioCtx = getCtx();
    const now = audioCtx.currentTime;
    FANFARE.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now + i * 0.12);
      g.gain.setValueAtTime(0.12, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.35);
    });
  }

  return { playNote, playFireworks, playCelebration };
}
