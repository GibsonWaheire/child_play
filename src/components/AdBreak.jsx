import { useEffect, useState } from 'react';
import AdBanner from './AdBanner';

const COUNTDOWN = 8; // seconds before skip button appears

export default function AdBreak({ onDone }) {
  const [secs, setSecs] = useState(COUNTDOWN);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#0d0d2b]">
      {/* Stars background hint */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a1a5e 0%, #0d0d2b 70%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 w-full max-w-xl">

        {/* Label */}
        <p className="text-white/40 text-xs tracking-[4px] uppercase">Short Break</p>

        {/* Ad slot */}
        <AdBanner type="rectangle" className="w-full" />

        {/* Countdown / skip */}
        <div className="flex flex-col items-center gap-3">
          {secs > 0 ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center
                           text-white font-black text-xl"
                style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
              >
                {secs}
              </div>
              <p className="text-white/40 text-sm tracking-wider">Resuming soon…</p>
            </div>
          ) : (
            <button
              onClick={onDone}
              className="bg-[#FDE047] text-black font-black text-lg rounded-full px-10 py-4
                         tracking-widest hover:scale-105 active:scale-95 transition-transform
                         shadow-lg shadow-yellow-400/30"
            >
              Keep Playing!
            </button>
          )}
        </div>

        {/* Fun message while waiting */}
        <p className="text-white/25 text-xs text-center tracking-wider max-w-xs">
          {secs > 0
            ? "Great playing! Just a tiny break..."
            : "Ready? Let's go!"}
        </p>
      </div>
    </div>
  );
}
