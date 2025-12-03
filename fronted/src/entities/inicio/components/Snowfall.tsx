import { useMemo } from 'react';

/**
 * Snowfall animation component.
 */
export const Snowfall = () => {
  // useMemo para generar copos solo una vez y evitar re-renders
  const snowflakes = useMemo(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.5 + 0.1,
      size: `${Math.random() * 0.4 + 0.1}rem`,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full animate-snowfall"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

