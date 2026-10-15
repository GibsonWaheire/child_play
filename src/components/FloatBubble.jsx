import { COLOR_POOL } from '../data/letterData';

// Random child-friendly emoji pool — shown alongside every letter bubble
const FUN_ICONS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
  '🐔','🐧','🦆','🦉','🦋','🐛','🐌','🐞','🦄','🐴','🦒','🦘','🐘','🐪','🐑',
  '🍎','🍊','🍋','🍇','🍓','🍒','🍑','🍍','🥥','🌽','🍄','🌰','🥕','🥦',
  '🎈','🎉','🎊','🎮','🎯','🎨','🥁','🎸',
  '⭐','🌟','💫','✨','🌈','🌙','☀️','🌸','🌺','🌻','🌊','🔥','❄️','🌈',
  '🚀','🛸','🎠','🎡','🏆','🎁','🍭','🍬','🍦','🎂','🍰',
];

const RADII  = ['50%', '44%', '38% 48% 44% 40%', '36%'];

function lighten(hex, amt = 75) {
  const n = parseInt(hex.replace('#',''), 16);
  return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;
}
function toRgba(hex, a) {
  const n = parseInt(hex.replace('#',''), 16);
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
  const xPct   = 8 + Math.random() * 84;
  const dur    = 2.8 + Math.random() * 1.4;
  const sz     = (82 + Math.random() * 48).toFixed(0) + 'px';
  const fs     = (2.1 + Math.random() * 1.2).toFixed(1) + 'rem';
  const iconFs = (1.6 + Math.random() * 0.8).toFixed(1) + 'rem';

  const wrapper = document.createElement('div');
  wrapper.className = 'float-bubble';
  wrapper.style.cssText = `
    left:${xPct}vw; bottom:80px;
    --dur:${dur}s; --cm:${color}; --cl:${light}; --cd:${dim};
    --sz:${sz}; --fs:${fs}; --br:${radius};`;

  // Letter bubble
  const circle = document.createElement('div');
  circle.className = 'bubble-circle';
  circle.textContent = label;

  // Fun icon below bubble
  const iconEl = document.createElement('div');
  iconEl.style.cssText = `font-size:${iconFs}; line-height:1; filter:drop-shadow(0 0 8px ${color}); animation:bubblePop 0.5s 0.1s cubic-bezier(0.34,1.6,0.64,1) both;`;
  iconEl.textContent = icon;

  wrapper.appendChild(circle);
  wrapper.appendChild(iconEl);
  document.body.appendChild(wrapper);

  // Coloured dot particles
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const size = (Math.random() * 9 + 4).toFixed(0) + 'px';
    const sd   = (0.4 + Math.random() * 0.6).toFixed(2) + 's';
    const dx   = ((Math.random() - 0.5) * 170).toFixed(0) + 'px';
    const dy   = (-(Math.random() * 130 + 30)).toFixed(0) + 'px';
    dot.style.cssText = `
      width:${size}; height:${size};
      left:${(xPct + (Math.random()-0.5)*8).toFixed(1)}vw;
      bottom:${(80 + Math.random()*90).toFixed(0)}px;
      background:${color}; box-shadow:0 0 7px ${color};
      --sd:${sd}; --sx:${dx}; --sy:${dy};`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), parseFloat(sd) * 1000 + 100);
  }

  setTimeout(() => wrapper.remove(), (dur + 0.3) * 1000);
}
