/**
 * Skeleton components for loading states.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-white/10';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Card skeleton for recipes, songs, etc.
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
    <Skeleton variant="rounded" height={160} className="mb-4" />
    <Skeleton variant="text" height={20} width="70%" className="mb-2" />
    <Skeleton variant="text" height={16} width="50%" />
  </div>
);

// List item skeleton
export const ListItemSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-4 p-4 ${className}`}>
    <Skeleton variant="circular" width={48} height={48} />
    <div className="flex-1">
      <Skeleton variant="text" height={18} width="60%" className="mb-2" />
      <Skeleton variant="text" height={14} width="40%" />
    </div>
  </div>
);

// Recipe card skeleton
export const RecipeCardSkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
    <Skeleton variant="rectangular" height={200} />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" height={24} width="80%" />
      <Skeleton variant="text" height={16} width="60%" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rounded" height={24} width={60} />
        <Skeleton variant="rounded" height={24} width={80} />
      </div>
    </div>
  </div>
);

// Song item skeleton
export const SongItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
    <Skeleton variant="rounded" width={56} height={56} />
    <div className="flex-1">
      <Skeleton variant="text" height={18} width="70%" className="mb-2" />
      <Skeleton variant="text" height={14} width="40%" />
    </div>
    <Skeleton variant="circular" width={40} height={40} />
  </div>
);

// Novena day skeleton
export const NovenaDaySkeleton: React.FC = () => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-5">
    <div className="flex items-center gap-4">
      <Skeleton variant="rounded" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" height={20} width="40%" className="mb-2" />
        <Skeleton variant="text" height={14} width="60%" />
      </div>
    </div>
  </div>
);

// Full page loader
export const PageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Cargando...' 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <div className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin" />
    <p className="text-white/70 text-sm">{message}</p>
  </div>
);

// Grid skeleton
export const GridSkeleton: React.FC<{ 
  count?: number; 
  columns?: number;
  ItemComponent?: React.FC;
}> = ({ 
  count = 6, 
  columns = 3,
  ItemComponent = CardSkeleton 
}) => (
  <div 
    className="grid gap-6"
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {[...Array(count)].map((_, i) => (
      <ItemComponent key={i} />
    ))}
  </div>
);

