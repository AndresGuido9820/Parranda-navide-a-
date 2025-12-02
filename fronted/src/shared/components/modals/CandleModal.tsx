import React, { Suspense, useState, useEffect } from 'react';
import { Candles } from '../candles/Candles';

interface CandleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

// Fallback while loading 3D
function CandlesFallback() {
  return (
    <div className="flex justify-center gap-7 py-2 relative z-10 h-[200px] items-center">
      <div className="animate-pulse text-4xl">🕯️</div>
      <div className="animate-pulse text-5xl" style={{ animationDelay: '0.2s' }}>🕯️</div>
      <div className="animate-pulse text-4xl" style={{ animationDelay: '0.4s' }}>🕯️</div>
    </div>
  );
}

export const CandleModal: React.FC<CandleModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [show3D, setShow3D] = useState(false);

  // Delay 3D rendering for smooth modal animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow3D(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShow3D(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div 
        className="w-full max-w-[720px] bg-gradient-to-b from-[#1a0a0a] to-[#0d0505] border border-amber-500/20 rounded-[24px] p-8 relative overflow-hidden"
        style={{
          boxShadow: `
            0 0 100px rgba(255, 150, 50, 0.15),
            0 0 60px rgba(255, 100, 0, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
      >
        {/* Ambient glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 60%, rgba(255, 150, 50, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 30% 50%, rgba(255, 100, 0, 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 70% 50%, rgba(255, 100, 0, 0.08) 0%, transparent 40%)
            `,
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-amber-200/60 hover:text-amber-200 hover:bg-white/5 transition-all z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 6.75l10.5 10.5M17.25 6.75L6.75 17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-10 text-center space-y-4">
          <h2 className="text-3xl font-bold text-amber-100 tracking-wide">
            Velas Encendidas
          </h2>
          
          <p className="text-amber-200/70 text-base max-w-md mx-auto">
            Que esta luz ilumine nuestro hogar y nuestro corazón en esta época de esperanza.
          </p>

          {/* 3D Candles */}
          <div className="relative">
            <Suspense fallback={<CandlesFallback />}>
              {show3D ? <Candles className="mx-auto" /> : <CandlesFallback />}
            </Suspense>
          </div>

          {/* Decorative stars */}
          <div className="absolute top-20 left-10 text-amber-400/30 text-xl animate-pulse">✦</div>
          <div className="absolute top-32 right-12 text-amber-400/20 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
          <div className="absolute bottom-40 left-16 text-amber-400/25 text-base animate-pulse" style={{ animationDelay: '1s' }}>✦</div>

          {/* Continue button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onContinue}
              className="group relative h-14 px-8 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold tracking-wide flex items-center gap-3 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                boxShadow: `
                  0 4px 20px rgba(255, 150, 50, 0.4),
                  0 8px 40px rgba(255, 100, 0, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.9" strokeWidth="2"/>
                <path d="M8 12.5l2.4 2.4L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="relative z-10">Continuar la Novena</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
