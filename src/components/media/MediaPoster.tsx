// ============================================
// Media Poster Component
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Media } from '@/lib/tmdb';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface MediaPosterProps {
  media: Media;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
  showOverlay?: boolean;
  className?: string;
  onPlayClick?: (media: Media) => void;
}

/**
 * Componente MediaPoster - Poster interactivo con efectos hover
 */
export function MediaPoster({
  media,
  size = 'md',
  priority = false,
  showOverlay = true,
  className,
  onPlayClick,
}: MediaPosterProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const title = media.title || 'Sin título';
  const rating = media.vote_average || 0;
  const year = media.year;

  // Tamaños
  const sizes = {
    sm: 'h-[180px] w-[120px]',
    md: 'h-[240px] w-[160px]',
    lg: 'h-[300px] w-[200px]',
    xl: 'h-[360px] w-[240px]',
  };

  const sizeClasses = sizes[size];

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayClick?.(media);
  };

  return (
    <Link
      to={`/${media.media_type}/${media.id}`}
      className={cn('relative group rounded-lg overflow-hidden', sizeClasses, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={media.poster_path}
        alt={title}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setImageLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-all duration-500',
          !imageLoaded && 'bg-muted',
          isHovered && 'scale-110 blur-sm'
        )}
      />

      {/* Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Gradient Overlay (always visible at bottom) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60" />

      {/* Hover Overlay */}
      {showOverlay && (
        <div
          className={cn(
            'absolute inset-0 bg-black/80 transition-opacity duration-300 flex items-center justify-center',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="flex flex-col items-center gap-3 p-4 text-center">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
              onClick={handlePlayClick}
            >
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </Button>
            <p className="text-sm font-medium line-clamp-3">{title}</p>
          </div>
        </div>
      )}

      {/* Top Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {/* Rating Badge */}
        {rating > 0 && (
          <Badge
            variant="secondary"
            className="bg-black/60 text-yellow-400 border-0 backdrop-blur-sm"
          >
            <Star className="h-3 w-3 fill-current mr-1" />
            {rating.toFixed(1)}
          </Badge>
        )}
        {/* Year Badge */}
        {year && (
          <Badge
            variant="secondary"
            className="bg-black/60 border-0 backdrop-blur-sm"
          >
            {year}
          </Badge>
        )}
      </div>

      {/* Media Type Badge */}
      <div className="absolute top-2 right-2">
        <Badge
          variant="secondary"
          className={cn(
            'bg-black/60 border-0 backdrop-blur-sm capitalize',
            media.media_type === 'movie' && 'bg-blue-500/20 text-blue-300',
            media.media_type === 'tv' && 'bg-purple-500/20 text-purple-300'
          )}
        >
          {media.media_type === 'movie' ? 'Película' : 'Serie'}
        </Badge>
      </div>

      {/* Bottom Info */}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-xs font-medium line-clamp-1 text-white drop-shadow-lg">
            {title}
          </p>
        </div>
      )}
    </Link>
  );
}

/**
 * Grid de posters
 */
export function MediaPosterGrid({
  media,
  loading = false,
  size = 'md',
  onPlayClick,
}: {
  media?: Media[];
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPlayClick?: (media: Media) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className={cn(
              'rounded-lg bg-muted animate-pulse',
              size === 'sm' && 'h-[180px] w-[120px]',
              size === 'md' && 'h-[240px] w-[160px]',
              size === 'lg' && 'h-[300px] w-[200px]',
              size === 'xl' && 'h-[360px] w-[240px]'
            )}
          />
        ))}
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
        No hay resultados
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {media.map((item) => (
        <MediaPoster
          key={`${item.media_type}-${item.id}`}
          media={item}
          size={size}
          onPlayClick={onPlayClick}
        />
      ))}
    </div>
  );
}
