'use client';

import React from 'react';

// Singh AI assistant avatar — high-quality AI-generated bust portrait (Nano Banana Pro).
// Renders inside a clean circle with an optional "speaking" glow ring.
export default function BotAvatar({
  size = 48,
  speaking = false,
  color = '#FF9A1F',
  className = '',
  objectPosition = 'center 26%',
  scale = 1.18,
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {speaking && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 0 2px ${color}`, animation: 'pulse-ring 1.7s ease-out infinite' }}
        />
      )}
      <span
        className="relative block h-full w-full overflow-hidden rounded-full"
        style={{ boxShadow: speaking ? `0 0 16px ${color}aa` : 'none', transition: 'box-shadow 0.3s ease' }}
      >
        <img
          src="/bot-avatar.png"
          alt="Singh AI assistant"
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ objectPosition, transform: `scale(${scale})` }}
        />
      </span>
    </span>
  );
}
