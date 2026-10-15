import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAudio } from '../hooks/useAudio';
import { useBeatQueue } from '../hooks/useBeatQueue';
import { spawnBubble } from '../components/FloatBubble';
import { magicWords } from '../data/magicWords';
import GuidePanel from '../components/GuidePanel';
import StarField from '../components/StarField';

const INACTIVITY_MS = 7000;
const ALLOWED = /^[a-zA-Z0-9 ]$/;

function spawnFireworks() {
  for (let i = 0; i < 22; i++) {
    const sb = document.createElement('div');
    sb.className = 'star-burst';
    const bx = ((Math.random() - 0.5) * window.innerWidth * 0.8).toFixed(0) + 'px';
    const by = (-(Math.random() * window.innerHeight * 0.65)).toFixed(0) + 'px';
    sb.style.cssText = `
      left:${(10 + Math.random()*80).toFixed(1)}vw;
      top:${(30 + Math.random()*40).toFixed(1)}vh;
      width:14px; height:14px;
      background:hsl(${Math.floor(Math.random()*360)},90%,65%);
      box-shadow:0 0 12px currentColor;
      animation-delay:${(Math.random()*0.35).toFixed(2)}s;
      --bx:${bx}; --by:${by};`;
    document.body.appendChild(sb);
    setTimeout(() => sb.remove(), 1500);
  }
}

export default function ChildPlay() {
  const { setMode, statsRef } = useApp();
  const { playNote, playFireworks, playCelebration } = useAudio();

  const typedRef       = useRef('');
  const inactivityRef  = useRef(null);
  const hasStarted     = useRef(false);

  const [stars,        setStars]       = useState(0);
  const [showHowTo,    setShowHowTo]   = useState(true);
  const [showGuide,    setShowGuide]   = useState(false);
  const [celebration,  setCelebration] = useState(null); // { word }
  const [promptHidden, setPromptHidden]= useState(false);

  // ── Stats snapshot for GuidePanel ──
  const [guideStats, setGuideStats] = useState(null);

  // ── Beat queue ──
  const fireKey = useCallback((key) => {
    if (key === ' ') {
      playFireworks();
      spawnFireworks();
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
    const kc = statsRef.current.keyCount;
    if (kc % 5 === 0) {
      statsRef.current.stars++;
      setStars(s => s + 1);
    }
  }, [playNote, playFireworks, statsRef]);

  const { enqueue, popLast, clearAll, activeDot, queueLen } = useBeatQueue(fireKey);

  function triggerCelebration(word) {
    playCelebration();
    spawnFireworks();
    statsRef.current.magicWords.push(word);
    statsRef.current.stars += 3;
    setStars(s => s + 3);
    setCelebration(word);
    setTimeout(() => setCelebration(null), 2500);
  }

  function resetInactivity() {
    clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      if (statsRef.current.keyCount >= 3) {
        setGuideStats({ ...statsRef.current });
        setShowGuide(true);
      }
    }, INACTIVITY_MS);
  }

  // ── Keyboard handler ──
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (showGuide) { setShowGuide(false); resetInactivity(); return; }

      if (e.key === 'Escape') {
        e.preventDefault();
        setGuideStats({ ...statsRef.current });
        setShowGuide(true);
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (!popLast()) typedRef.current = typedRef.current.slice(0, -1);
        return;
      }
      if (!ALLOWED.test(e.key)) return;
      e.preventDefault();

      if (!hasStarted.current) {
        hasStarted.current = true;
        statsRef.current.startTime = Date.now();
        setShowHowTo(false);
      }

      enqueue(e.key);
      resetInactivity();
      setPromptHidden(true);
      clearTimeout(window._promptTimer);
      window._promptTimer = setTimeout(() => setPromptHidden(false), 4000);
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showGuide, enqueue, popLast, statsRef]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 80%, #1a1a5e 0%, #0d0d2b 60%)' }}>
      <StarField />

      {/* Ground glow */}
      <div className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-[2]"
           style={{ background: 'linear-gradient(to top, rgba(100,60,200,0.22), transparent)' }} />

      {/* Star counter */}
      <div className="fixed top-4 right-5 z-20 flex items-center gap-2 text-2xl font-black">
        <span>⭐</span>
        <span className="text-yellow-300 text-lg" style={{ textShadow: '0 0 10px #FDE047' }}>
          {stars}
        </span>
      </div>

      {/* Queue badge */}
      {queueLen > 0 && (
        <div className="fixed top-4 left-5 z-20 text-white/35 text-sm tracking-widest">
          {queueLen} queued
        </div>
      )}

      {/* Beat dots */}
      <div className="fixed bottom-14 w-full flex justify-center gap-3 z-20 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`beat-dot ${activeDot === i ? 'active' : ''}`} />
        ))}
      </div>

      {/* Prompt */}
      {!promptHidden && (
        <p className="fixed bottom-6 w-full text-center text-white/40 text-sm tracking-widest z-10 prompt-pulse pointer-events-none">
          Press any key!
        </p>
      )}

      {/* How-to */}
      {showHowTo && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-[5rem] mb-4">⌨️</div>
          <p className="text-white/70 text-xl font-bold tracking-widest">Press any key to make music!</p>
          <p className="text-white/30 text-sm mt-3 tracking-wide">Letters · Numbers · Space = fireworks</p>
        </div>
      )}

      {/* Celebration overlay */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className={`text-center celebration-show`}>
            <p className="text-white font-black tracking-widest"
               style={{ fontSize:'clamp(2.5rem,10vw,6rem)', textShadow:'0 0 40px rgba(255,220,0,0.8)' }}>
              {celebration}!
            </p>
          </div>
        </div>
      )}

      {/* Guide panel */}
      {showGuide && guideStats && (
        <GuidePanel
          stats={guideStats}
          onKeepPlaying={() => { setShowGuide(false); resetInactivity(); }}
          onParentMode={() => { setShowGuide(false); setMode('gate'); }}
        />
      )}
    </div>
  );
}
