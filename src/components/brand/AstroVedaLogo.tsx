'use client';

import React from 'react';

interface AstroVedaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function AstroVedaLogo({
  className = '',
  size = 40,
  showText = false,
}: AstroVedaLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Sacred Vedic Sri Yantra & Celestial Sun Motif */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_12px_rgba(229,184,66,0.45)] transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Radiant Sacred Gold Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="35%" stopColor="#E5B842" />
            <stop offset="70%" stopColor="#C99426" />
            <stop offset="100%" stopColor="#8A5A0D" />
          </linearGradient>

          {/* Mystic Indigo Celestial Core */}
          <radialGradient id="celestialCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2E1B5B" />
            <stop offset="60%" stopColor="#14102C" />
            <stop offset="100%" stopColor="#0B0E17" />
          </radialGradient>

          {/* Outer Sun Glow Filter */}
          <filter id="vedicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Sacred Protective Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
          opacity="0.8"
        />

        {/* 12 Solar Rays / 12 Bhavas Petals */}
        <g stroke="url(#goldGradient)" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
          <line x1="50" y1="4" x2="50" y2="14" />
          <line x1="50" y1="86" x2="50" y2="96" />
          <line x1="4" y1="50" x2="14" y2="50" />
          <line x1="86" y1="50" x2="96" y2="50" />
          <line x1="17.5" y1="17.5" x2="24.5" y2="24.5" />
          <line x1="75.5" y1="75.5" x2="82.5" y2="82.5" />
          <line x1="17.5" y1="82.5" x2="24.5" y2="75.5" />
          <line x1="75.5" y1="24.5" x2="82.5" y2="17.5" />
          {/* 30-deg Intermediaries */}
          <line x1="32.7" y1="8.7" x2="36.2" y2="17.4" />
          <line x1="67.3" y1="8.7" x2="63.8" y2="17.4" />
          <line x1="32.7" y1="91.3" x2="36.2" y2="82.6" />
          <line x1="67.3" y1="91.3" x2="63.8" y2="82.6" />
        </g>

        {/* Celestial Background Plate */}
        <circle cx="50" cy="50" r="35" fill="url(#celestialCore)" stroke="url(#goldGradient)" strokeWidth="1.5" />

        {/* Sacred Sri Yantra Interlocking Triangles */}
        {/* Ascending Fire Triangle (Shiva / पुरुषार्थ) */}
        <polygon
          points="50,21 75,67 25,67"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1.6"
          opacity="0.95"
        />

        {/* Descending Water Triangle (Shakti / प्रकृति) */}
        <polygon
          points="50,79 75,33 25,33"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1.6"
          opacity="0.95"
        />

        {/* Inner Diamond / North Indian Lagna Core */}
        <polygon
          points="50,31 65,50 50,69 35,50"
          fill="rgba(229,184,66,0.12)"
          stroke="url(#goldGradient)"
          strokeWidth="1.2"
        />

        {/* Bindu (Central Cosmic Source of Divine Light) */}
        <circle cx="50" cy="50" r="4.5" fill="url(#goldGradient)" filter="url(#vedicGlow)" />
        <circle cx="50" cy="50" r="2" fill="#FFFFFF" />

        {/* Micro Astrological Navagraha Dots */}
        <circle cx="50" cy="37" r="1.5" fill="url(#goldGradient)" />
        <circle cx="61" cy="50" r="1.5" fill="url(#goldGradient)" />
        <circle cx="50" cy="63" r="1.5" fill="url(#goldGradient)" />
        <circle cx="39" cy="50" r="1.5" fill="url(#goldGradient)" />
      </svg>

      {showText && (
        <div className="flex flex-col select-none">
          <span className="text-lg font-black tracking-tight text-white flex items-center gap-0.5 font-heading">
            Astro<span className="text-gold-400">Veda</span>
          </span>
          <span className="text-[9px] text-gold-300/80 uppercase tracking-widest font-semibold -mt-0.5">
            वैदिक ज्योतिष
          </span>
        </div>
      )}
    </div>
  );
}
