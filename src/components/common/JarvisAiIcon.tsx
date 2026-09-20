import React from 'react';

interface JarvisAiIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPulse?: boolean;
}

export const JarvisAiIcon: React.FC<JarvisAiIconProps> = ({
  className = '',
  size = 'md',
  isPulse = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
    >
      {/* Ambient Neon Outer Glow */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 blur-[8px] opacity-70 ${
          isPulse ? 'animate-pulse' : ''
        }`}
      />

      {/* Cyber Frame Container */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0C162D] via-[#0A0F1D] to-[#060A14] border border-cyan-400/40 p-1.5 flex items-center justify-center shadow-lg shadow-sky-500/30 overflow-hidden group">
        {/* Subtle Futuristic Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_70%)] pointer-events-none" />

        {/* Custom High-Tech Neural Arc Reactor SVG */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-sky-400 transform group-hover:scale-110 transition-transform duration-300"
        >
          <defs>
            <linearGradient id="jarvisCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="jarvisOrbitalGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <filter id="coreGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Rotating Energy Ring Segments */}
          <circle
            cx="24"
            cy="24"
            r="19"
            stroke="url(#jarvisOrbitalGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6 8 4"
            className="opacity-60 origin-center animate-[spin_12s_linear_infinite]"
          />

          {/* Hexagonal Shield Core */}
          <polygon
            points="24,8 37,16 37,32 24,40 11,32 11,16"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Inner Orbital Arc */}
          <circle
            cx="24"
            cy="24"
            r="13"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="22 18"
            className="origin-center animate-[spin_6s_linear_infinite_reverse]"
          />

          {/* Central Neural Node (Arc Reactor) */}
          <circle
            cx="24"
            cy="24"
            r="6.5"
            fill="url(#jarvisCoreGlow)"
            filter="url(#coreGlowFilter)"
          />

          {/* High Energy Center Pin */}
          <circle cx="24" cy="24" r="2.5" fill="#ffffff" />

          {/* 4 Directional Laser Emitters */}
          <line x1="24" y1="5" x2="24" y2="10" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="38" x2="24" y2="43" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="24" x2="10" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="24" x2="43" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

export default JarvisAiIcon;
