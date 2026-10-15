import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Global hover sound ────────────────────────────────────────────────────────
// Plays a soft ping on any button/link hover anywhere in the app.
// Uses a single shared AudioContext to avoid creating too many.
let _hoverCtx = null;
function getHoverCtx() {
  if (!_hoverCtx) _hoverCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _hoverCtx;
}

document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('button, a, [data-hover-sound]');
  if (!el) return;
  try {
    const ctx = getHoverCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    // Soft high ping — friendly not jarring
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + Math.random() * 150, ctx.currentTime);
    g.gain.setValueAtTime(0.045, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } catch {}
}, { passive: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
