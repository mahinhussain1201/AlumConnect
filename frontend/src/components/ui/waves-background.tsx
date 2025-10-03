import React from "react";
import { cn } from "../../lib/utils";

interface WavesBackgroundProps {
  className?: string;
  color?: string;
  waveCount?: number;
  speed?: number;
}

export const WavesBackground: React.FC<WavesBackgroundProps> = ({
  className,
  color = "#3b82f6", // Default light blue
  waveCount = 3,
  speed = 20,
}) => {
  const waves = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 4 + i * 0.5,
    amplitude: 20 + i * 10,
    frequency: 0.02 + i * 0.005,
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {waves.map((wave) => (
          <path
            key={wave.id}
            d={`M0,400 Q300,${400 - wave.amplitude} 600,400 T1200,400 L1200,800 L0,800 Z`}
            fill="url(#waveGradient)"
            opacity={0.3 - wave.id * 0.1}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; -100 0; 0 0"
              dur={`${wave.duration}s`}
              begin={`${wave.delay}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </svg>
      <style>{`
        @keyframes wave-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .wave-animation {
          animation: wave-pulse ${speed}s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
