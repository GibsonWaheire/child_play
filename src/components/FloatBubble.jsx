import { COLOR_POOL } from '../data/letterData';

// Large child-friendly icon pool — shown as its own floating element
const FUN_ICONS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
  '🐔','🐧','🦆','🦉','🦋','🐛','🌈','🦄','🐴','🦒','🦘','🐘','🦓','🐬','🐳',
  '🍎','🍊','🍋','🍇','🍓','🍒','🍦','🍭','🍬','🎂','🍕','🌽','🥕','🍄',
  '🎈','🎉','🎊','🥁','🎸','🎮','🚀','🛸','⭐','🌟','💫','✨','🌙','☀️',
  '🌸','🌺','🌻','🔥','❄️','🌊','🎠','🏆','🎁','🎯','🎨','🪄','🦋','🌈',
];

const RADII = ['50%', '44%', '38% 48% 44% 40%', '36%'];

function lighten(hex, amt = 75) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;
}
function toRgba(hex, a) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${n>>16},${(n>>8)&0xff},${n&0xff},${a})`;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function spawnBubble(key) {
  const label  = key === ' ' ? 'SPACE' : key.toUpperCase();
  const color  = pick(COLOR_POOL);
  const icon   = pick(FUN_ICONS);
  const light  = lighten(color);
  const dim    = toRgba(color, 0.3);
  const radius = pick(RADII);

  // Letter bubble position
  const xPct  = 12 + Math.random() * 76;
  const dur   = 2.8 + Math.random() * 1.4;
  const sz    = (85 + Math.random() * 45).toFixed(0) + 'px';
  const fs    = (2.2 + Math.random() * 1.1).toFixed(1) + 'rem';

  // Floating icon spawns nearby but independently
  const iconX   = xPct + (Math.random() - 0.5) * 20;
  const iconDur = 2.4 + Math.random() * 1.6;
  const iconSz  = (3.5 + Math.random() * 2.5).toFixed(1) + 'rem';
  const iconDelay = (Math.random() * 0.15).toFixed(2) + 's';

  // ── Letter bubble ──
  const wrapper = document.createElement('div');
  wrapper.className = 'float-bubble';
  wrapper.style.cssText = `
    left:${xPct}vw; bottom:80px;
    --dur:${dur}s; --cm:${color}; --cl:${light}; --cd:${dim};
    --sz:${sz}; --fs:${fs}; --br:${radius};`;

  const circle = document.createElement('div');
  circle.className = 'bubble-circle';
  circle.textContent = label;
  wrapper.appendChild(circle);
  document.body.appendChild(wrapper);

  // ── Standalone large icon — floats independently ──
  const iconWrapper = document.createElement('div');
  iconWrapper.style.cssText = `
    position:fixed; pointer-events:none; z-index:16;
    left:${Math.max(4, Math.min(92, iconX)).toFixed(1)}vw;
    bottom:${(90 + Math.random() * 60).toFixed(0)}px;
    font-size:${iconSz};
    line-height:1;
    filter:drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${dim});
    animation:floatUp ${iconDur}s ${iconDelay} ease-out forwards, wobbleIcon 0.45s ${iconDelay} cubic-bezier(0.34,1.6,0.64,1) both;`;
  iconWrapper.textContent = icon;
  document.body.appendChild(iconWrapper);

  // ── Dot particles ──
  for (let i = 0; i < 9; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const size = (Math.random() * 10 + 4).toFixed(0) + 'px';
    const sd   = (0.4 + Math.random() * 0.65).toFixed(2) + 's';
    const dx   = ((Math.random() - 0.5) * 180).toFixed(0) + 'px';
    const dy   = (-(Math.random() * 140 + 30)).toFixed(0) + 'px';
    dot.style.cssText = `
      width:${size}; height:${size};
      left:${(xPct + (Math.random()-0.5)*10).toFixed(1)}vw;
      bottom:${(80 + Math.random()*100).toFixed(0)}px;
      background:${color}; box-shadow:0 0 8px ${color};
      --sd:${sd}; --sx:${dx}; --sy:${dy};`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), parseFloat(sd) * 1000 + 100);
  }

  setTimeout(() => wrapper.remove(), (dur + 0.3) * 1000);
  setTimeout(() => iconWrapper.remove(), (iconDur + parseFloat(iconDelay) + 0.3) * 1000);
}
