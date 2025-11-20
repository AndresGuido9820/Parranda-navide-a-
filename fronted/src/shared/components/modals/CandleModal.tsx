import React from 'react';

interface CandleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const CandleModal: React.FC<CandleModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[720px] bg-[#1a1212] border border-red-500/25 rounded-[20px] p-9 relative shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:bg-white/6 transition-all active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 6.75l10.5 10.5M17.25 6.75L6.75 17.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          <h2 className="text-[26px] font-bold text-[#f3f3f3] tracking-wide mr-9">
            Velas encendidas ✨
          </h2>
          
          <p className="text-[#b8abab] text-sm mr-9">
            Que esta luz ilumine nuestro hogar y nuestro corazón.
          </p>

          {/* Halo effect */}
          <div className="absolute inset-0 top-9 w-[380px] h-[380px] mx-auto bg-gradient-radial from-[#f7a940]/12 to-transparent blur-[18px] pointer-events-none z-0"></div>

          {/* Candles */}
          <div className="flex justify-center gap-7 py-2 relative z-10">
            {/* Vela 1 */}
            <div className="relative w-9 h-[120px] rounded-xl bg-gradient-to-b from-white to-[#f2f2f2] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.25)]">
              {/* Mecha */}
              <div className="absolute -top-[10px] left-1/2 w-[3px] h-3 bg-[#3b2f2f] rounded-sm transform -translate-x-1/2 shadow-[0_2px_0_rgba(0,0,0,0.25)_inset] z-[2]"></div>
              {/* Llama */}
              <svg className="absolute -top-[26px] left-1/2 w-[22px] h-[30px] transform -translate-x-1/2 z-[1] animate-pulse" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="g1" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fff6b3"/>
                    <stop offset="55%" stopColor="#ffd36b"/>
                    <stop offset="85%" stopColor="#f7a940"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <path d="M12 0 C15 5 18 10 18 14 C18 20 14.5 24 12 24 C9.5 24 6 20 6 14 C6 10 9 5 12 0 Z" fill="url(#g1)" filter="drop-shadow(0 0 10px rgba(247,169,64,0.55)) drop-shadow(0 0 26px rgba(247,169,64,0.35))"/>
              </svg>
            </div>

            {/* Vela 2 */}
            <div className="relative w-9 h-[120px] rounded-xl bg-gradient-to-b from-white to-[#f2f2f2] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.25)]">
              {/* Mecha */}
              <div className="absolute -top-[10px] left-1/2 w-[3px] h-3 bg-[#3b2f2f] rounded-sm transform -translate-x-1/2 shadow-[0_2px_0_rgba(0,0,0,0.25)_inset] z-[2]"></div>
              {/* Llama */}
              <svg className="absolute -top-[26px] left-1/2 w-[22px] h-[30px] transform -translate-x-1/2 z-[1] animate-pulse" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="g2" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fff6b3"/>
                    <stop offset="55%" stopColor="#ffd36b"/>
                    <stop offset="85%" stopColor="#f7a940"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <path d="M12 0 C15 5 18 10 18 14 C18 20 14.5 24 12 24 C9.5 24 6 20 6 14 C6 10 9 5 12 0 Z" fill="url(#g2)" filter="drop-shadow(0 0 10px rgba(247,169,64,0.55)) drop-shadow(0 0 26px rgba(247,169,64,0.35))"/>
              </svg>
            </div>

            {/* Vela 3 */}
            <div className="relative w-9 h-[120px] rounded-xl bg-gradient-to-b from-white to-[#f2f2f2] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.25)]">
              {/* Mecha */}
              <div className="absolute -top-[10px] left-1/2 w-[3px] h-3 bg-[#3b2f2f] rounded-sm transform -translate-x-1/2 shadow-[0_2px_0_rgba(0,0,0,0.25)_inset] z-[2]"></div>
              {/* Llama */}
              <svg className="absolute -top-[26px] left-1/2 w-[22px] h-[30px] transform -translate-x-1/2 z-[1] animate-pulse" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="g3" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fff6b3"/>
                    <stop offset="55%" stopColor="#ffd36b"/>
                    <stop offset="85%" stopColor="#f7a940"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <path d="M12 0 C15 5 18 10 18 14 C18 20 14.5 24 12 24 C9.5 24 6 20 6 14 C6 10 9 5 12 0 Z" fill="url(#g3)" filter="drop-shadow(0 0 10px rgba(247,169,64,0.55)) drop-shadow(0 0 26px rgba(247,169,64,0.35))"/>
              </svg>
            </div>
          </div>

          {/* Continue button */}
          <div className="flex justify-center pt-[18px]">
            <button
              onClick={onContinue}
              className="h-[46px] px-[22px] pl-[18px] rounded-[23px] border border-white/6 bg-[#e74a3b] text-white font-semibold tracking-wide flex items-center gap-[10px] cursor-pointer shadow-[0_8px_24px_rgba(231,74,59,0.35)] hover:shadow-[0_10px_28px_rgba(231,74,59,0.45)] active:translate-y-[1px] active:bg-[#c83e31] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.9" strokeWidth="1.8"/>
                <path d="M8 12.5l2.4 2.4L16 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Continuar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
