import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../hooks/useAudio';
import { useBeatQueue } from '../hooks/useBeatQueue';
import { spawnBubble } from '../components/FloatBubble';
import { magicWords } from '../data/magicWords';
import AdBreak from '../components/AdBreak';
import StarField from '../components/StarField';

const AD_INTERVAL_MS = 3 * 60 * 1000;
const AD_KEY_TRIGGER = 40;
const ALLOWED        = /^[a-zA-Z0-9 ]$/;

function spawnFireworks() {
  for (let i = 0; i < 22; i++) {
    const sb = document.createElement('div');
    sb.className = 'star-burst';
    sb.style.cssText = `
      left:${(10+Math.random()*80).toFixed(1)}vw;
      top:${(25+Math.random()*45).toFixed(1)}vh;
      width:14px; height:14px;
      background:hsl(${Math.floor(Math.random()*360)},90%,65%);
      box-shadow:0 0 12px currentColor;
      animation-delay:${(Math.random()*0.35).toFixed(2)}s;
      --bx:${((Math.random()-0.5)*window.innerWidth*0.8).toFixed(0)}px;
      --by:${(-(Math.random()*window.innerHeight*0.65)).toFixed(0)}px;`;
    document.body.appendChild(sb);
    setTimeout(() => sb.remove(), 1500);
  }
}

export default function ChildPlay() {
  const { setMode, statsRef } = useApp();
  const { playNote, playFireworks, playCelebration } = useAudio();

  const typedRef      = useRef('');
  const hasStarted    = useRef(false);
  const lastAdTime    = useRef(null);
  const keysSinceAd   = useRef(0);
  const audioCtxRef   = useRef(null);

  const [stars,        setStars]       = useState(0);
  const [showHowTo,    setShowHowTo]   = useState(true);
  const [showAdBreak,  setShowAdBreak] = useState(false);
  const [celebration,  setCelebration] = useState(null);
  const [promptHidden, setPromptHidden]= useState(false);
  const [exitVisible,  setExitVisible] = useState(false); // shown on 3s corner hover

  // ── Hover sound (soft ping, very quiet) ───────────────────────────────────
  function playHoverSound() {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type  = 'sine';
      osc.frequency.setValueAtTime(880 + Math.random()*200, ctx.currentTime);
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  // ── Ad break check ─────────────────────────────────────────────────────────
  function maybeShowAd() {
    if (showAdBreak) return;
    const timeSinceAd = lastAdTime.current ? Date.now() - lastAdTime.current : Infinity;
    if (keysSinceAd.current >= AD_KEY_TRIGGER && timeSinceAd >= AD_INTERVAL_MS) {
      lastAdTime.current  = Date.now();
      keysSinceAd.current = 0;
      setShowAdBreak(true);
    }
  }

  // ── Beat queue callback ────────────────────────────────────────────────────
  const fireKey = useCallback((key) => {
    if (key === ' ') {
      playFireworks(); spawnFireworks();
      const word = typedRef.current.trim().toUpperCase();
      if (magicWords[word]) triggerCelebration(word);
      typedRef.current = '';
      return;
    }
    playNote();
    spawnBubble(key);
    typedRef.current += key.toUpperCase();
    for (const w of Object.keys(magicWords)) {
      if (typedRef.current.endsWith(w)) {
        triggerCelebration(w);
        typedRef.current = '';
        break;
      }
    }
    statsRef.current.keyCount++;
    keysSinceAd.current++;
    if (statsRef.current.keyCount % 5 === 0) {
      statsRef.current.stars++;
      setStars(s => s + 1);
    }
    maybeShowAd();
  }, [playNote, playFireworks, statsRef]);

  const { enqueue, popLast, activeDot, queueLen } = useBeatQueue(fireKey);

  function triggerCelebration(word) {
    playCelebration(); spawnFireworks();
    statsRef.current.magicWords.push(word);
    statsRef.current.stars += 3;
    setStars(s => s + 3);
    setCelebration(word);
    setTimeout(() => setCelebration(null), 2500);
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (showAdBreak) return;
      if (e.key === 'Escape') { e.preventDefault(); return; } // Escape does nothing — only corner button exits
      if (e.key === 'Backspace') {
        e.preventDefault();
        popLast();
        typedRef.current = typedRef.current.slice(0, -1);
        return;
      }
      if (!ALLOWED.test(e.key)) return;
      e.preventDefault();
      if (!hasStarted.current) {
        hasStarted.current = true;
        statsRef.current.startTime = Date.now();
        lastAdTime.current = Date.now();
        setShowHowTo(false);
      }
      enqueue(e.key);
      setPromptHidden(true);
      clearTimeout(window._promptTimer);
      window._promptTimer = setTimeout(() => setPromptHidden(false), 4000);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showAdBreak, enqueue, popLast, statsRef]);

  // ── Corner exit zone — hover 2s to reveal button ───────────────────────────
  const cornerTimerRef = useRef(null);

  function onCornerEnter() {
    cornerTimerRef.current = setTimeout(() => setExitVisible(true), 2000);
  }
  function onCornerLeave() {
    clearTimeout(cornerTimerRef.current);
    setExitVisible(false);
  }

  return (
    // Fullscreen, no pointer events on anything outside the play area
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background:'radial-gradient(ellipse at 50% 80%, #1a1a5e 0%, #0d0d2b 60%)' }}
    >
      <StarField />

      <div className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-[2]"
           style={{ background:'linear-gradient(to top, rgba(100,60,200,0.22), transparent)' }} />

      {/* Star counter — top right, no interaction */}
      <div className="fixed top-4 right-5 z-20 flex items-center gap-2 font-black text-2xl pointer-events-none">
        <span>⭐</span>
        <span className="text-yellow-300 text-lg" style={{ textShadow:'0 0 10px #FDE047' }}>{stars}</span>
      </div>

      {/* Queue badge */}
      {queueLen > 0 && (
        <div className="fixed top-4 left-5 z-20 text-white/25 text-sm tracking-widest pointer-events-none">
          {queueLen} queued
        </div>
      )}

      {/* Beat dots */}
      <div className="fixed bottom-14 w-full flex justify-center gap-3 z-20 pointer-events-none">
        {Array.from({length:8},(_,i) => (
          <div key={i} className={`beat-dot ${activeDot===i?'active':''}`} />
        ))}
      </div>

      {/* Prompt */}
      {!promptHidden && (
        <p className="fixed bottom-5 w-full text-center text-white/35 text-sm tracking-widest z-10 prompt-pulse pointer-events-none">
          Press any key!
        </p>
      )}

      {/* How-to */}
      {showHowTo && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none gap-3">
          <div className="text-[5rem]">⌨️</div>
          <p className="text-white/70 text-xl font-bold tracking-widest">Press any key to make music!</p>
          <p className="text-white/30 text-sm tracking-wide">Letters · Numbers · Space = fireworks</p>
          <p className="text-white/20 text-xs tracking-wide mt-1">Spell CAT · DOG · STAR · LOVE for a surprise!</p>
        </div>
      )}

      {/* Celebration */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="celebration-show text-center">
            <p className="text-white font-black tracking-widest"
               style={{ fontSize:'clamp(2.5rem,10vw,6rem)', textShadow:'0 0 40px rgba(255,220,0,0.8)' }}>
              {celebration}!
            </p>
          </div>
        </div>
      )}

      {/* ── Hidden exit zone — bottom-left corner, hover 2s to reveal ── */}
      <div
        className="fixed bottom-0 left-0 w-16 h-16 z-[60]"
        onMouseEnter={onCornerEnter}
        onMouseLeave={onCornerLeave}
      >
        {exitVisible && (
          <button
            onClick={() => setMode('gate')}
            onMouseEnter={playHoverSound}
            className="absolute bottom-2 left-2 bg-black/60 border border-white/20 text-white/60
                       text-[10px] tracking-widest font-bold rounded-xl px-3 py-2
                       hover:bg-black/80 hover:text-white transition-all backdrop-blur-sm"
          >
            END SESSION
          </button>
        )}
      </div>

      {/* Ad break */}
      {showAdBreak && (
        <AdBreak onDone={() => setShowAdBreak(false)} />
      )}
    </div>
  );
}
