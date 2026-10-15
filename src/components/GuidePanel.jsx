const CHAOS = [
  { min: 0, label: 'Calm Explorer',      color: '#60A5FA' },
  { min: 1, label: 'Warming Up',         color: '#4ADE80' },
  { min: 2, label: 'Playful Chaos',      color: '#FCD34D' },
  { min: 3, label: 'Wild Typer!',        color: '#FB923C' },
  { min: 5, label: 'KEYBOARD SMASHER!',  color: '#F87171' },
];

function getChaos(kps) {
  return CHAOS.reduce((prev, cur) => kps >= cur.min ? cur : prev, CHAOS[0]);
}

export default function GuidePanel({ stats, onKeepPlaying, onParentMode }) {
  const dur   = stats.startTime ? Math.round((Date.now() - stats.startTime) / 1000) : 0;
  const chaos = getChaos(dur > 0 ? stats.keyCount / dur : 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="guide-card bg-[#13132a] border border-white/10 rounded-[28px] p-8 w-[min(92vw,460px)] flex flex-col gap-5 shadow-2xl">
        <h2 className="text-white text-2xl font-black text-center tracking-widest">
          Great session!
        </h2>

        <Stat label="Keys smashed" value={stats.keyCount} big />
        <Stat label="Duration"     value={`${dur} sec`} />
        <Stat label="Stars earned" value={`${stats.stars} ⭐`} />
        <Stat label="Chaos level"  value={chaos.label} valueStyle={{ color: chaos.color }} />

        {stats.magicWords.length > 0 && (
          <Stat label="Magic words" value={stats.magicWords.join(', ')} />
        )}

        <button
          onClick={onKeepPlaying}
          className="bg-[#FDE047] text-black font-black text-lg rounded-full py-4 tracking-widest
                     hover:scale-[1.03] active:scale-95 transition-transform shadow-lg shadow-yellow-400/30"
        >
          Keep Playing!
        </button>

        <button
          onClick={onParentMode}
          className="text-white/40 text-sm text-center hover:text-white/70 transition-colors"
        >
          Exit to Parent Mode
        </button>

        <p className="text-white/30 text-xs text-center tracking-wider">
          Tip: spell CAT · DOG · STAR · LOVE for a surprise!
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, big, valueStyle }) {
  return (
    <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
      <span className="text-white/50 text-sm tracking-wide">{label}</span>
      <span
        className={`font-black ${big ? 'text-3xl text-[#FDE047]' : 'text-lg text-white'}`}
        style={valueStyle}
      >
        {value}
      </span>
    </div>
  );
}
