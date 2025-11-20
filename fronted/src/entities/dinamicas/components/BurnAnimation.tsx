import React from 'react';

interface BurnAnimationProps {
  isBurning?: boolean;
}

const FIRE_SIZE = 500;
const BURN_SIZE = 100;
const BURN_COUNT = 40;

export const BurnAnimation: React.FC<BurnAnimationProps> = ({ isBurning = true }) => {
  if (!isBurning) {
    return null;
  }

  const particles: React.ReactNode[] = [];

  for (let i = 1; i <= BURN_COUNT * 2; i++) {
    const isHeat = i <= BURN_COUNT;
    const randomHeight = isHeat 
      ? Math.floor(Math.random() * 10) 
      : Math.floor(Math.random() * (BURN_SIZE / 2));
    const randomMarginLeft = Math.floor(Math.random() * FIRE_SIZE - FIRE_SIZE / 2);
    const randomDuration = Math.floor(Math.random() * 2000 + 1000);

    particles.push(
      <div
        key={`particle-${i}`}
        className={`absolute bg-black rounded-full ${isHeat ? 'heat' : ''}`}
        style={{
          top: `${FIRE_SIZE}px`,
          left: `${-BURN_SIZE / 2}px`,
          width: `${BURN_SIZE}px`,
          height: `${randomHeight}px`,
          marginLeft: `${randomMarginLeft}px`,
          animation: `burning ${randomDuration}ms -3000ms infinite linear`,
        }}
      />
    );
  }

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-40 flex items-end justify-center" style={{ height: '400px' }}>
      <style>{`
        @keyframes burning {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-${FIRE_SIZE + BURN_SIZE}px);
          }
        }
      `}</style>
      <div
        className="relative"
        style={{
          marginTop: `-${FIRE_SIZE / 4}px`,
          transition: '100ms',
        }}
      >
        <div
          className="relative"
          style={{
            width: `${FIRE_SIZE}px`,
            height: `${FIRE_SIZE}px`,
            backgroundColor: '#ff9900',
            filter: 'blur(20px) contrast(30)',
            border: `${FIRE_SIZE / 2}px solid #000`,
            borderBottomColor: 'transparent',
            borderRadius: '40%',
            boxSizing: 'border-box',
            transform: 'scale(0.4, 1)',
          }}
        >
          {particles}
        </div>
      </div>
    </div>
  );
};