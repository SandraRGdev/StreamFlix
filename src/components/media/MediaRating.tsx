// ============================================
// Media Rating Component
// ============================================

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaRatingProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'star' | 'badge' | 'text';
  className?: string;
}

/**
 * Componente MediaRating - Muestra el rating de diferentes formas
 */
export function MediaRating({
  rating,
  maxRating = 10,
  showValue = true,
  size = 'md',
  variant = 'star',
  className,
}: MediaRatingProps) {
  // Normalizar rating a escala de 5
  const normalizedRating = (rating / maxRating) * 5;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const starSize = sizes[size];

  // Variante Star
  if (variant === 'star') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <div className="flex items-center">
          {/* Full stars */}
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`full-${i}`}
              className={cn(starSize, 'fill-yellow-400 text-yellow-400')}
            />
          ))}
          {/* Half star */}
          {hasHalfStar && (
            <StarHalf
              className={cn(starSize, 'fill-yellow-400 text-yellow-400')}
            />
          )}
          {/* Empty stars */}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star
              key={`empty-${i}`}
              className={cn(starSize, 'text-muted-foreground')}
            />
          ))}
        </div>
        {showValue && (
          <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
        )}
      </div>
    );
  }

  // Variante Badge
  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-sm font-medium text-yellow-400',
          className
        )}
      >
        <Star className={cn(starSize, 'fill-current')} />
        {showValue && <span>{rating.toFixed(1)}</span>}
      </div>
    );
  }

  // Variante Text (solo número)
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Star className={cn(starSize, 'fill-yellow-400 text-yellow-400')} />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">/ {maxRating}</span>
    </div>
  );
}

/**
 * Badge de rating simple (solo número)
 */
export function RatingBadge({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  // Color según rating
  const getColor = () => {
    if (rating >= 8) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (rating >= 6) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (rating >= 4) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold',
        getColor(),
        className
      )}
    >
      {rating.toFixed(1)}
    </div>
  );
}
