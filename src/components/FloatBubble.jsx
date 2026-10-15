import { useEffect, useRef } from 'react';
import { COLOR_POOL } from '../data/letterData';

const RADII = ['50%', '44%', '38% 48% 44% 40%', '36%'];

function lighten(hex, amt = 75) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function toRgba(hex, a) {
  const n = parseInt(hex.replace('#',''), 16);
  return `rgba(${n>>16},${(n>>8)&0xff},${n&0xff},${a})`;
}

// Imperatively create & remove a bubble DOM node.
// Using DOM directly keeps bubbles lightweight — no React re-renders per keystroke.
export function spawnBubble(key) {
  const label     = key === ' ' ? 'SPACE' : key.toUpperCase();
  const color     = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
  const light     = lighten(color);
  const dim       = toRgba(color, 0.3);
  const radius    = RADII[Math.floor(Math.random() * RADII.length)];
  const xPct      = 8 + Math.random() * 84;
  const dur       = 2.6 + Math.random() * 1.4;
  const sz        = Math.floor(80 + Math.random() * 50) + 'px';
  const fs        = Math.floor(2 + Math.random() * 1.5) + 'rem';

  const wrapper = document.createElement('div');
  wrapper.className = 'float-bubble';
  wrapper.style.cssText = `left:${xPct}vw; bottom:80px;
    --dur:${dur}s; --cm:${color}; --cl:${light}; --cd:${dim};
    --sz:${sz}; --fs:${fs}; --br:${radius};`;

  const circle = document.createElement('div');
  circle.className = 'bubble-circle';
  circle.textContent = label;

  wrapper.appendChild(circle);
  document.body.appendChild(wrapper);

  // Coloured dot particles
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const size = (Math.random() * 9 + 4) + 'px';
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
