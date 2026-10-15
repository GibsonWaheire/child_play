import { useApp } from '../contexts/AppContext';
import AdBanner from '../components/AdBanner';

const CHAOS = [
  { min: 0, label: 'Calm Explorer',     color: '#60A5FA' },
  { min: 1, label: 'Warming Up',        color: '#4ADE80' },
  { min: 2, label: 'Playful Chaos',     color: '#FCD34D' },
  { min: 3, label: 'Wild Typer!',       color: '#FB923C' },
  { min: 5, label: 'KEYBOARD SMASHER', color: '#F87171' },
];

function getChaos(kps) {
  return CHAOS.reduce((p, c) => kps >= c.min ? c : p, CHAOS[0]);
}

const TIPS = [
  'Keyboard play improves fine motor skills and letter recognition.',
  'Letting children freely type builds confidence with technology.',
  'Sound feedback helps connect letters to sounds — great for phonics!',
  'Short play sessions (5-10 min) are ideal for toddlers.',
  'Try sitting with your child and naming the animals together!',
];

export default function ParentMode() {
  const { setMode, statsRef, resetStats } = useApp();
  const s   = statsRef.current;
  const dur = s.startTime ? Math.round((Date.now() - s.startTime) / 1000) : 0;
  const kps = dur > 0 ? (s.keyCount / dur) : 0;
  const chaos = getChaos(kps);
  const tip   = TIPS[Math.floor(Math.random() * TIPS.length)];

  function goBack() {
    setMode('child');
  }

  function newSession() {
    resetStats();
    setMode('child');
  }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white overflow-y-auto">
      {/* Top leaderboard ad */}
      <div className="flex justify-center pt-4 px-4">
        <AdBanner type="leaderboard" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Main column ── */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-wider">Parent Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">Your child's play session</p>
            </div>
            <div className="text-3xl">👨‍👩‍👧</div>
          </div>

          {/* Stats card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-2 gap-4">
            <BigStat label="Keys Smashed" value={s.keyCount} color="#FDE047" />
            <BigStat label="Duration"     value={`${dur}s`}  color="#60A5FA" />
            <BigStat label="Stars Earned" value={s.stars}    color="#FDE047" />
            <BigStat label="Chaos Level"  value={chaos.label} color={chaos.color} small />
          </div>

          {/* Magic words */}
          {s.magicWords.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/50 text-xs tracking-widest mb-3">MAGIC WORDS FOUND</p>
              <div className="flex flex-wrap gap-2">
                {s.magicWords.map((w, i) => (
                  <span key={i} className="bg-[#FDE047]/20 text-[#FDE047] font-bold text-sm px-3 py-1 rounded-full">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-white/60 text-sm leading-relaxed">{tip}</p>
          </div>

          {/* Rectangle ad on mobile (hidden on lg) */}
          <div className="flex justify-center lg:hidden">
            <AdBanner type="rectangle" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={goBack}
              className="flex-1 bg-white/10 border border-white/20 text-white font-bold
                         rounded-xl py-4 tracking-widest hover:bg-white/20 transition-colors"
            >
              Back to Play
            </button>
            <button
              onClick={newSession}
              className="flex-1 bg-[#FDE047] text-black font-black rounded-xl py-4
                         tracking-widest hover:scale-[1.02] active:scale-95 transition-transform
                         shadow-lg shadow-yellow-400/25"
            >
              New Session
            </button>
          </div>

          {/* Bottom rectangle ad */}
          <div className="flex justify-center pb-4">
            <AdBanner type="rectangle" />
          </div>
        </div>

        {/* ── Sidebar (lg only) ── */}
        <div className="hidden lg:flex flex-col gap-6 w-[320px]">
          <AdBanner type="rectangle" />
          <AdBanner type="halfpage" />
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, color, small }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-white/40 text-xs tracking-widest">{label}</span>
      <span
        className={`font-black ${small ? 'text-base' : 'text-3xl'}`}
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}
