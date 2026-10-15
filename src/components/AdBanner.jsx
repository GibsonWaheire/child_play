// AdBanner — replace the inner div content with your AdSense <ins> tag
// Sizes: 'leaderboard' = 728×90, 'rectangle' = 300×250, 'half-page' = 300×600

const sizes = {
  leaderboard: { w: '100%', h: '90px',  label: '728 × 90  Leaderboard' },
  rectangle:   { w: '300px',h: '250px', label: '300 × 250  Rectangle'  },
  halfpage:    { w: '300px',h: '600px', label: '300 × 600  Half Page'  },
};

export default function AdBanner({ type = 'leaderboard', className = '' }) {
  const { w, h, label } = sizes[type] ?? sizes.leaderboard;

  return (
    <div
      className={`flex items-center justify-center bg-white/5 border border-dashed
                  border-white/20 rounded-xl overflow-hidden ${className}`}
      style={{ width: w, height: h, maxWidth: '100%' }}
    >
      {/* ── Replace this block with your AdSense <ins> tag ── */}
      <div className="text-center text-white/30 text-xs tracking-widest select-none">
        <p className="text-lg mb-1">AD</p>
        <p>{label}</p>
        <p className="mt-1 text-[10px]">Insert AdSense code here</p>
      </div>
    </div>
  );
}
