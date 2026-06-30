'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Darken/lighten a hex color. p>0 lightens, p<0 darkens.
function shade(hex, p) {
  const c = (hex || '#FF9A1F').replace('#', '');
  const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  const f = p / 100;
  r = Math.round(r + (f < 0 ? r * f : (255 - r) * f));
  g = Math.round(g + (f < 0 ? g * f : (255 - g) * f));
  b = Math.round(b + (f < 0 ? b * f : (255 - b) * f));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Custom animated Sikh bot avatar (Bitmoji / Snapchat style).
// Blinks, gently bobs, waves a hand on greeting and moves its mouth when speaking.
export default function SinghAvatar({ size = 120, color = '#FF9A1F', accent = '#FFD24A', speaking = false, wave = false }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timer;
    const loop = () => {
      const delay = 2200 + Math.random() * 2800;
      timer = setTimeout(() => {
        if (!mounted) return;
        setBlink(true);
        setTimeout(() => mounted && setBlink(false), 140);
        loop();
      }, delay);
    };
    loop();
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  const skin = '#E8B98C';
  const skinShade = '#D7A877';
  const beard = '#23262E';
  const turbanDark = shade(color, -22);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 250"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`turbanG-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>

      {/* Neck */}
      <rect x="104" y="188" width="32" height="30" rx="12" fill={skinShade} />

      {/* Beard backdrop */}
      <path d="M68 128 C62 200 110 230 120 230 C130 230 178 200 172 128 C172 128 160 178 120 178 C80 178 68 128 68 128 Z" fill={beard} />

      {/* Ears */}
      <ellipse cx="70" cy="144" rx="9" ry="13" fill={skinShade} />
      <ellipse cx="170" cy="144" rx="9" ry="13" fill={skinShade} />

      {/* Face */}
      <ellipse cx="120" cy="140" rx="50" ry="53" fill={skin} />

      {/* Sideburns / beard frame */}
      <path d="M72 118 C70 168 92 192 120 194 C148 192 170 168 168 118 C160 152 146 166 120 166 C94 166 80 152 72 118 Z" fill={beard} />

      {/* Turban */}
      <path d="M56 130 C42 60 92 28 120 28 C148 28 198 60 184 130 C184 130 176 106 168 102 C150 90 150 82 120 82 C90 82 90 90 72 102 C64 106 56 130 56 130 Z" fill={`url(#turbanG-${color.replace('#', '')})`} />
      <path d="M111 82 L129 82 L120 104 Z" fill={turbanDark} />
      <path d="M70 104 C95 88 145 88 170 104" stroke={turbanDark} strokeWidth="3.5" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M62 120 C95 96 145 96 178 120" stroke={turbanDark} strokeWidth="3.5" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Eyebrows */}
      <rect x="89" y="119" width="24" height="6" rx="3" fill={beard} transform="rotate(-4 101 122)" />
      <rect x="127" y="119" width="24" height="6" rx="3" fill={beard} transform="rotate(4 139 122)" />

      {/* Eyes (blink) */}
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: blink ? 'scaleY(0.1)' : 'scaleY(1)', transition: 'transform 0.08s ease' }}>
        <ellipse cx="101" cy="135" rx="9" ry="10.5" fill="#ffffff" />
        <ellipse cx="139" cy="135" rx="9" ry="10.5" fill="#ffffff" />
        <circle cx="103" cy="136" r="4.6" fill="#23262E" />
        <circle cx="141" cy="136" r="4.6" fill="#23262E" />
        <circle cx="104.6" cy="134" r="1.6" fill="#fff" />
        <circle cx="142.6" cy="134" r="1.6" fill="#fff" />
      </g>

      {/* Nose */}
      <path d="M118 142 C115 154 113 158 120 160 C127 158 125 154 122 142" fill={skinShade} opacity="0.7" />

      {/* Mustache */}
      <path d="M103 165 C112 160 118 163 120 166 C122 163 128 160 137 165 C130 172 124 171 120 168 C116 171 110 172 103 165 Z" fill={beard} />

      {/* Mouth (speaks) */}
      <motion.ellipse
        cx="120"
        cy="175"
        rx="8.5"
        ry={3}
        fill="#7A2E2E"
        animate={{ ry: speaking ? [2, 7, 3, 8, 2] : 3 }}
        transition={{ duration: 0.55, repeat: speaking ? Infinity : 0, ease: 'easeInOut' }}
      />

      {/* Waving hand */}
      {wave && (
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
          animate={{ rotate: [0, 18, -6, 18, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
        >
          <circle cx="196" cy="176" r="15" fill={skin} />
          <rect x="188" y="150" width="5" height="18" rx="2.5" fill={skin} />
          <rect x="194.5" y="147" width="5" height="21" rx="2.5" fill={skin} />
          <rect x="201" y="150" width="5" height="18" rx="2.5" fill={skin} />
          <rect x="207" y="153" width="5" height="15" rx="2.5" fill={skin} />
        </motion.g>
      )}
    </motion.svg>
  );
}
