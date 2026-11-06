import React, { useMemo } from 'react';

interface SnowflakeData {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export const SnowEffect: React.FC = () => {
  const snowflakes = useMemo<SnowflakeData[]>(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 7 + Math.random() * 9, // 7s to 16s
      animationDelay: -(Math.random() * 12),
      size: 10 + Math.random() * 14,
      opacity: 0.35 + Math.random() * 0.45
    }));
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden" 
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake-element select-none text-sky-200"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
};
