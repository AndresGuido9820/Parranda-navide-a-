/**
 * Beautiful animated candles with CSS + SVG.
 */

import { useEffect, useState } from 'react';

interface CandleProps {
  height: number;
  delay?: number;
}

function Candle({ height, delay = 0 }: CandleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="relative flex flex-col items-center transition-all duration-1000"
      style={{ 
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {/* Flame container */}
      <div className="relative w-12 h-16 -mb-1">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 150, 50, 0.5) 0%, transparent 70%)',
            animationDuration: '2s',
          }}
        />
        
        {/* Main flame SVG */}
        <svg 
          viewBox="0 0 40 60" 
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(255,150,50,0.8)]"
          style={{
            animation: 'flameFlicker 0.5s ease-in-out infinite alternate, flameSway 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 8px rgba(255,200,100,0.9))',
          }}
        >
          <defs>
            <linearGradient id={`flameGrad-${delay}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ff4400" />
              <stop offset="30%" stopColor="#ff6600" />
              <stop offset="50%" stopColor="#ff9900" />
              <stop offset="70%" stopColor="#ffcc00" />
              <stop offset="85%" stopColor="#ffee88" />
              <stop offset="100%" stopColor="#ffffee" />
            </linearGradient>
            <radialGradient id={`innerGlow-${delay}`} cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffdd88" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Outer flame shape */}
          <path 
            d="M20 2 C25 12, 32 20, 32 32 C32 45, 26 55, 20 55 C14 55, 8 45, 8 32 C8 20, 15 12, 20 2 Z"
            fill={`url(#flameGrad-${delay})`}
            opacity="0.9"
          />
          
          {/* Inner bright core */}
          <ellipse 
            cx="20" 
            cy="40" 
            rx="6" 
            ry="12"
            fill={`url(#innerGlow-${delay})`}
          />
          
          {/* Blue base */}
          <ellipse
            cx="20"
            cy="52"
            rx="4"
            ry="3"
            fill="#6699ff"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Wick */}
      <div 
        className="w-0.5 h-3 rounded-full z-10"
        style={{ 
          background: 'linear-gradient(to bottom, #1a1a1a, #333)',
        }}
      />

      {/* Candle body */}
      <div 
        className="relative rounded-lg shadow-2xl"
        style={{
          width: '28px',
          height: `${height}px`,
          background: 'linear-gradient(to right, #f5e6d3, #fff8f0, #f5e6d3)',
          boxShadow: `
            inset 2px 0 8px rgba(0,0,0,0.1),
            inset -2px 0 8px rgba(0,0,0,0.1),
            0 4px 20px rgba(0,0,0,0.3),
            0 0 40px rgba(255,150,50,0.15)
          `,
        }}
      >
        {/* Wax drip details */}
        <div 
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 rounded-full"
          style={{ background: 'linear-gradient(to bottom, #fffaf5, #f5e6d3)' }}
        />
      </div>
    </div>
  );
}

function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div 
      className="absolute w-1 h-1 rounded-full animate-float"
      style={{
        background: 'radial-gradient(circle, #ffdd88 0%, transparent 70%)',
        boxShadow: '0 0 4px #ffcc44',
        ...style,
      }}
    />
  );
}

interface CandlesProps {
  className?: string;
}

export function Candles({ className }: CandlesProps) {
  return (
    <div className={`${className} relative`} style={{ height: '280px' }}>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes flameFlicker {
          0% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.05) scaleX(0.97); }
          100% { transform: scaleY(0.95) scaleX(1.03); }
        }
        
        @keyframes flameSway {
          0%, 100% { transform: rotate(-2deg) translateX(0); }
          25% { transform: rotate(1deg) translateX(1px); }
          50% { transform: rotate(2deg) translateX(-1px); }
          75% { transform: rotate(-1deg) translateX(1px); }
        }
        
        @keyframes float {
          0% { 
            transform: translateY(0) translateX(0); 
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-150px) translateX(20px); 
            opacity: 0;
          }
        }
      `}</style>

      {/* Background ambient glow */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(255,120,50,0.2) 0%, transparent 60%)',
          animationDuration: '3s',
        }}
      />

      {/* Candles container */}
      <div className="absolute inset-0 flex items-end justify-center gap-6 pb-8">
        <Candle height={100} delay={0} />
        <Candle height={130} delay={150} />
        <Candle height={90} delay={300} />
      </div>

      {/* Floating sparkles */}
      {[...Array(12)].map((_, i) => (
        <Sparkle
          key={i}
          style={{
            left: `${20 + Math.random() * 60}%`,
            bottom: '60px',
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Base/table surface */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        style={{
          width: '200px',
          height: '8px',
          background: 'linear-gradient(to bottom, #1a0a05, #0a0502)',
          borderRadius: '50%',
          boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}
