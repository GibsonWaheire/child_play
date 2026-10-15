import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import AdBanner from '../components/AdBanner';

// ── Pricing plans ─────────────────────────────────────────────────────────────
// To activate payments: create a Stripe account → get a Payment Link URL per plan
// → replace the href="#" values below with your Stripe Payment Link URLs.
const PLANS = [
  {
    id:       'no-ads',
    name:     'No Ads',
    price:    '$1.99',
    period:   '/ month',
    color:    '#60A5FA',
    features: ['Remove all ads', 'Unlimited play', 'Session reports'],
    stripe:   '#', // ← replace with Stripe Payment Link
  },
  {
    id:       'games',
    name:     'All Games',
    price:    '$3.99',
    period:   '/ month',
    color:    '#FDE047',
    popular:  true,
    features: ['No ads', '10+ children\'s games', 'All instrument sounds', 'Premium themes'],
    stripe:   '#',
  },
  {
    id:       'family',
    name:     'Family',
    price:    '$5.99',
    period:   '/ month',
    color:    '#4ADE80',
    features: ['Everything in All Games', 'Up to 4 child profiles', 'Progress reports by email', 'Priority support'],
    stripe:   '#',
  },
];

const CHAOS = [
  { min:0, label:'Calm Explorer',    color:'#60A5FA' },
  { min:1, label:'Warming Up',       color:'#4ADE80' },
  { min:2, label:'Playful Chaos',    color:'#FCD34D' },
  { min:3, label:'Wild Typer!',      color:'#FB923C' },
  { min:5, label:'KEYBOARD SMASHER', color:'#F87171' },
];

function getChaos(kps) {
  return CHAOS.reduce((p,c) => kps >= c.min ? c : p, CHAOS[0]);
}

export default function ParentMode() {
  const { setMode, statsRef, resetStats } = useApp();
  const [tab, setTab] = useState('stats'); // 'stats' | 'plans'
  const s   = statsRef.current;
  const dur = s.startTime ? Math.round((Date.now() - s.startTime) / 1000) : 0;
  const chaos = getChaos(dur > 0 ? s.keyCount / dur : 0);

  function backToPlay()  { setMode('child'); }
  function newSession()  { resetStats(); setMode('child'); }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white flex flex-col">

      {/* ── Top leaderboard ad ── */}
      <div className="flex justify-center pt-3 px-4 shrink-0">
        <AdBanner type="leaderboard" />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-xl font-black tracking-wider">Parent Dashboard</h1>
          <p className="text-white/40 text-xs mt-0.5 tracking-wide">Session overview & settings</p>
        </div>
        <div className="text-3xl">👨‍👩‍👧</div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-white/10 shrink-0">
        {[['stats','📊 Session'], ['plans','💳 Premium']].map(([id,label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-3 text-sm font-bold tracking-widest transition-colors
              ${tab === id ? 'text-white border-b-2 border-[#FDE047]' : 'text-white/35 hover:text-white/60'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full flex flex-col gap-5">

          {tab === 'stats' && (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Keys Smashed" value={s.keyCount} color="#FDE047" big />
                <StatCard label="Duration"     value={`${dur}s`}  color="#60A5FA" />
                <StatCard label="Stars"        value={`${s.stars} ⭐`} color="#FDE047" />
                <StatCard label="Chaos Level"  value={chaos.label} color={chaos.color} small />
              </div>

              {/* Magic words */}
              {s.magicWords.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/40 text-xs tracking-widest mb-3">MAGIC WORDS FOUND</p>
                  <div className="flex flex-wrap gap-2">
                    {s.magicWords.map((w,i) => (
                      <span key={i} className="bg-[#FDE047]/15 text-[#FDE047] font-bold text-sm px-3 py-1 rounded-full border border-[#FDE047]/30">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mid rectangle ad */}
              <div className="flex justify-center">
                <AdBanner type="rectangle" />
              </div>

              {/* Tip */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-start">
                <span className="text-xl shrink-0">💡</span>
                <p className="text-white/50 text-sm leading-relaxed">
                  Free keyboard play builds fine motor skills, letter recognition, and cause-and-effect thinking in toddlers ages 1–5.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button onClick={backToPlay}
                  className="flex-1 bg-white/8 border border-white/15 text-white font-bold rounded-xl py-3.5 text-sm tracking-widest hover:bg-white/15 transition-colors">
                  Back to Play
                </button>
                <button onClick={newSession}
                  className="flex-1 bg-[#FDE047] text-black font-black rounded-xl py-3.5 text-sm tracking-widest hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-yellow-400/20">
                  New Session
                </button>
              </div>

              {/* Bottom rectangle ad */}
              <div className="flex justify-center pb-2">
                <AdBanner type="rectangle" />
              </div>
            </>
          )}

          {tab === 'plans' && (
            <>
              <div className="text-center mb-2">
                <h2 className="text-lg font-black tracking-wider">Remove Ads & Unlock More</h2>
                <p className="text-white/40 text-xs mt-1 tracking-wide">Cancel anytime · Secure payment via Stripe</p>
              </div>

              {PLANS.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}

              {/* Payment security note */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
                <span className="text-2xl shrink-0">🔒</span>
                <div>
                  <p className="text-white/70 text-sm font-bold">Secure Payment</p>
                  <p className="text-white/35 text-xs mt-0.5 leading-relaxed">
                    Payments processed by Stripe. We never store your card details.
                    Accepts Visa, Mastercard, Amex, Apple Pay &amp; Google Pay.
                  </p>
                </div>
              </div>

              {/* Payment icons row */}
              <div className="flex justify-center gap-3 flex-wrap">
                {['💳 Visa','💳 Mastercard','💳 Amex','🍎 Apple Pay','🤖 Google Pay'].map(m => (
                  <span key={m} className="text-white/25 text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    {m}
                  </span>
                ))}
              </div>

              {/* Leaderboard ad below plans */}
              <div className="flex justify-center pt-2">
                <AdBanner type="leaderboard" />
              </div>

              <button onClick={backToPlay}
                className="w-full text-white/30 text-sm hover:text-white/60 transition-colors py-2">
                Back to Play
              </button>
            </>
          )}
        </div>

        {/* Sidebar ads — desktop only */}
        <div className="hidden lg:flex flex-col gap-5 w-[320px] px-4 py-6 shrink-0">
          <AdBanner type="rectangle" />
          <AdBanner type="halfpage" />
        </div>
      </div>
    </div>
  );
}

// ── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({ plan }) {
  return (
    <div className={`relative bg-white/5 border rounded-2xl p-5 flex flex-col gap-4
                     ${plan.popular ? 'border-[#FDE047]/60' : 'border-white/10'}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FDE047] text-black
                        text-xs font-black px-4 py-1 rounded-full tracking-widest">
          MOST POPULAR
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-black text-lg tracking-wide" style={{ color: plan.color }}>
            {plan.name}
          </h3>
          <p className="text-white/40 text-xs mt-0.5 tracking-wide">per child account</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{plan.price}</span>
          <span className="text-white/40 text-xs ml-1">{plan.period}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/70">
            <span style={{ color: plan.color }}>✓</span> {f}
          </li>
        ))}
      </ul>

      {/* Replace href="#" with your Stripe Payment Link URL */}
      <a
        href={plan.stripe}
        className="block text-center font-black text-sm py-3.5 rounded-xl tracking-widest
                   transition-transform hover:scale-[1.02] active:scale-95"
        style={{ background: plan.color, color: plan.popular ? '#000' : '#fff' }}
      >
        Subscribe with Card
      </a>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, big, small }) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-white/35 text-xs tracking-widest">{label}</span>
      <span className={`font-black ${big ? 'text-3xl' : small ? 'text-sm' : 'text-xl'}`} style={{ color }}>
        {value}
      </span>
    </div>
  );
}
