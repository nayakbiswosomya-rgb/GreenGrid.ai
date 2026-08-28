import React from 'react';

interface GreenGridLogoProps {
  size?: number | string;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: 'dark' | 'light' | 'emerald';
  animated?: boolean;
}

export const GreenGridLogo: React.FC<GreenGridLogoProps> = ({
  size = 36,
  className = '',
  showWordmark = false,
  wordmarkClassName = '',
  variant = 'dark',
  animated = false,
}) => {
  const pixelSize = typeof size === 'number' ? size : 36;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon Mark */}
      <div 
        className={`relative flex items-center justify-center shrink-0 ${animated ? 'group' : ''}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md pointer-events-none -z-10 transition duration-500 group-hover:bg-emerald-400/35 group-hover:blur-lg" 
        />

        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Main Outer G Curve Gradient */}
            <linearGradient id="gg-outer-grad" x1="20" y1="180" x2="180" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>

            {/* Inner Leaf Gradient */}
            <linearGradient id="gg-leaf-grad" x1="70" y1="100" x2="170" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="85%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>

            {/* Circuit Track Gradient */}
            <linearGradient id="gg-circuit-grad" x1="40" y1="170" x2="160" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="30%" stopColor="#0d9488" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>

            {/* Leaf Vein Shading */}
            <linearGradient id="gg-vein-grad" x1="90" y1="95" x2="160" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.7" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="gg-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Node Soft Glow Filter */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Shadow Swirl */}
          <path
            d="M95 182 C48 182 22 145 22 102 C22 55 60 22 108 22 C138 22 165 36 178 58 C165 52 145 46 120 46 C75 46 45 74 45 106 C45 142 70 162 104 162 C132 162 152 146 158 126 L118 126 C112 126 108 122 108 116 C108 110 112 106 118 106 L168 106 C174 106 178 110 178 116 C178 152 146 182 95 182 Z"
            fill="black"
            fillOpacity="0.18"
          />

          {/* 1. Main Stylized "G" Outer Body Ribbon (Left & Bottom Curve) */}
          <path
            d="M 108 25 C 62 26 24 60 24 105 C 24 148 55 180 102 180 C 145 180 175 152 178 114 C 168 118 154 122 140 122 C 135 148 118 162 98 162 C 64 162 44 135 44 103 C 44 72 66 45 104 43 C 122 42 140 48 155 58 C 145 42 128 28 108 25 Z"
            fill="url(#gg-outer-grad)"
          />

          {/* 2. Inner Swirl Ribbon (3D Volume Arc) */}
          <path
            d="M 104 43 C 68 45 46 72 46 103 C 46 132 64 156 94 158 C 72 150 58 132 58 105 C 58 80 76 56 105 52 C 122 50 138 54 150 63 C 137 51 121 44 104 43 Z"
            fill="#065f46"
            fillOpacity="0.5"
          />

          {/* 3. The Botanical Leaf (Top & Right Crest of G) */}
          <path
            d="M 92 102 C 92 102 88 64 120 40 C 145 22 176 18 178 18 C 178 18 174 48 156 72 C 138 96 108 104 92 102 Z"
            fill="url(#gg-leaf-grad)"
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.25))"
          />

          {/* Leaf Central Main Vein */}
          <path
            d="M 96 98 C 112 88 132 68 174 21"
            stroke="url(#gg-vein-grad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Leaf Side Veins */}
          <path
            d="M 115 82 C 124 78 134 82 142 86"
            stroke="#d1fae5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M 130 67 C 140 60 152 64 160 67"
            stroke="#d1fae5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M 146 51 C 154 44 164 47 170 49"
            stroke="#d1fae5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M 124 74 C 118 66 116 57 118 50"
            stroke="#d1fae5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <path
            d="M 142 56 C 136 48 135 40 138 34"
            stroke="#d1fae5"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* 4. Circuit Traces & Microgrid Electronic Highway on the 'G' */}
          {/* Main Horizontal G Bar Circuit */}
          <path
            d="M 98 102 L 148 102 L 160 114 L 160 134 L 148 146 L 126 146"
            stroke="url(#gg-circuit-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lower Circuit Branch */}
          <path
            d="M 72 152 L 95 152 L 110 138 L 138 138"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />

          {/* Outer Loop Circuit Branch */}
          <path
            d="M 38 122 L 56 122 L 74 140 L 86 140"
            stroke="#2dd4bf"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top Left Leaf Circuit Integration */}
          <path
            d="M 88 52 L 102 38 L 122 38"
            stroke="#6ee7b7"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 60 76 L 76 60 L 92 60"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Circuit Protrusions (Tech Nodes extending out) */}
          <path
            d="M 160 120 L 176 120"
            stroke="#2dd4bf"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 152 90 L 174 74"
            stroke="#2dd4bf"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* 5. Glowing Microgrid Terminal Nodes (Circles / Dots) */}
          {/* Top Leaf Bridge Node */}
          <circle cx="122" cy="38" r="4.5" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" filter="url(#node-glow)" />
          
          {/* Left Arc Nodes */}
          <circle cx="60" cy="76" r="4" fill="#6ee7b7" stroke="#065f46" strokeWidth="1.5" filter="url(#node-glow)" />
          <circle cx="38" cy="122" r="4.5" fill="#2dd4bf" stroke="#047857" strokeWidth="1.5" filter="url(#node-glow)" />
          <circle cx="86" cy="140" r="4" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" filter="url(#node-glow)" />

          {/* Bottom Arc Node */}
          <circle cx="72" cy="152" r="4.5" fill="#34d399" stroke="#064e3b" strokeWidth="1.5" filter="url(#node-glow)" />
          <circle cx="126" cy="146" r="4" fill="#67e8f9" stroke="#047857" strokeWidth="1.5" filter="url(#node-glow)" />

          {/* Center G Crossbar Nodes */}
          <circle cx="98" cy="102" r="5" fill="#ecfdf5" stroke="#059669" strokeWidth="2" filter="url(#node-glow)" />
          <circle cx="138" cy="138" r="4" fill="#a7f3d0" stroke="#0d9488" strokeWidth="1.5" filter="url(#node-glow)" />

          {/* Right Circuit Node Outposts */}
          <circle cx="176" cy="120" r="5.5" fill="#2dd4bf" stroke="#065f46" strokeWidth="2" filter="url(#node-glow)" />
          <circle cx="174" cy="74" r="5.5" fill="#34d399" stroke="#065f46" strokeWidth="2" filter="url(#node-glow)" />

          {/* Inner Light Pulses (Center node cores) */}
          <circle cx="176" cy="120" r="2" fill="#ffffff" />
          <circle cx="174" cy="74" r="2" fill="#ffffff" />
          <circle cx="98" cy="102" r="2" fill="#10b981" />
          <circle cx="38" cy="122" r="1.8" fill="#ffffff" />
          <circle cx="122" cy="38" r="1.8" fill="#ffffff" />
        </svg>
      </div>

      {/* Wordmark (greengrid.ai) */}
      {showWordmark && (
        <div className={`flex items-baseline font-bold tracking-tight ${wordmarkClassName}`}>
          {variant === 'light' ? (
            <span className="text-[#0d3b2e] text-lg font-black tracking-tight">
              green<span className="text-[#059669]">grid</span>
              <span className="text-[#10b981] font-medium text-base ml-0.5">.ai</span>
            </span>
          ) : (
            <span className="text-white text-lg font-black tracking-tight flex items-baseline">
              <span className="text-slate-100">green</span>
              <span className="text-emerald-400">grid</span>
              <span className="text-teal-300 font-semibold text-sm ml-0.5 tracking-normal">.ai</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
