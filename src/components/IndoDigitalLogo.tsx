import React from 'react';

interface IndoDigitalLogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'card';
  height?: number | string;
}

export const IndoDigitalLogo: React.FC<IndoDigitalLogoProps> = ({
  className = '',
  theme = 'card',
  height = 54,
}) => {
  const isDarkBg = theme === 'dark';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 540 180"
        style={{ height, width: 'auto' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <defs>
          {/* Blue to Cyan Gradient for the 'D' loop */}
          <linearGradient id="idDLoopGrad" x1="40" y1="140" x2="180" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Orange Arrow Gradient */}
          <linearGradient id="idOrangeGrad" x1="100" y1="120" x2="185" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>

          {/* Network Line Glow */}
          <linearGradient id="idNetworkGrad" x1="80" y1="110" x2="160" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* EMBLEM: 'i' Dot */}
        <circle cx="50" cy="38" r="11" fill="#1e3a8a" />

        {/* EMBLEM: Lower 'i' Stem curving to bottom */}
        <path
          d="M 50 62 L 50 128 C 50 144 64 154 82 150 C 96 146 110 134 116 122"
          stroke="#1e3a8a"
          strokeWidth="15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* EMBLEM: 'D' Sweeping Tech Loop */}
        <path
          d="M 54 130 C 50 162 104 168 136 144 C 168 120 182 82 152 50 C 138 36 112 36 94 48"
          stroke="url(#idDLoopGrad)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* EMBLEM: Tech Network Nodes inside 'D' */}
        <g opacity="0.95">
          {/* Connecting Lines */}
          <line x1="85" y1="115" x2="114" y2="86" stroke="url(#idNetworkGrad)" strokeWidth="3" />
          <line x1="114" y1="86" x2="142" y2="108" stroke="url(#idNetworkGrad)" strokeWidth="3" />
          <line x1="114" y1="86" x2="152" y2="60" stroke="#f97316" strokeWidth="3.5" />
          <line x1="85" y1="115" x2="110" y2="132" stroke="url(#idNetworkGrad)" strokeWidth="3" />
          <line x1="110" y1="132" x2="142" y2="108" stroke="url(#idNetworkGrad)" strokeWidth="3" />
          <line x1="142" y1="108" x2="160" y2="92" stroke="url(#idNetworkGrad)" strokeWidth="3" />

          {/* Network Nodes (Circles) */}
          <circle cx="85" cy="115" r="6" fill="#f97316" />
          <circle cx="114" cy="86" r="7.5" fill="#0284c7" />
          <circle cx="142" cy="108" r="6.5" fill="#0284c7" />
          <circle cx="110" cy="132" r="5" fill="#38bdf8" />
          <circle cx="160" cy="92" r="5" fill="#f97316" />

          {/* Upward Growth Arrow pointing top-right */}
          <path
            d="M 148 64 L 174 44 M 174 44 L 158 43 M 174 44 L 173 60"
            stroke="url(#idOrangeGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* WORDMARK: 'INDO' */}
        <text
          x="212"
          y="90"
          fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
          fontWeight="900"
          fontSize="68"
          letterSpacing="1"
          fill={isDarkBg ? '#ffffff' : '#1e3a8a'}
        >
          INDO
        </text>

        {/* WORDMARK: 'DIGITAL' */}
        <text
          x="212"
          y="136"
          fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
          fontWeight="800"
          fontSize="46"
          letterSpacing="3"
          fill="#1d4ed8"
        >
          DIGITAL
        </text>

        {/* SUBTITLE: 'INOVASI DIGITAL INDONESIA' */}
        <text
          x="214"
          y="160"
          fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="4.5"
          fill={isDarkBg ? '#94a3b8' : '#475569'}
        >
          INOVASI DIGITAL INDONESIA
        </text>
      </svg>
    </div>
  );
};
