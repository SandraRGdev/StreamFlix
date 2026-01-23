// ============================================
// Media Card Component
// ============================================

import { Link } from 'react-router-dom';
import type { Media } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Calendar, Film, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaCardProps {
  media: Media;
  priority?: boolean;
  className?: string;
}

/**
 * Componente MediaCard - Muestra una tarjeta con información básica de media
 */
export function MediaCard({ media, priority = false, className }: MediaCardProps) {
  const title = media.title || 'Sin título';
  const year = media.year || 'N/A';
  const rating = media.vote_average || 0;
  const mediaType = media.media_type;

  return (
    <Link to={`/${mediaType}/${media.id}`}>
      <Card
        className={cn(
          'group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-transparent hover:border-primary/50',
          className
        )}
      >
        <CardContent className="p-0">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden bg-muted">
            <img
              src={media.poster_path}
              alt={title}
              loading={priority ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Media Type Badge */}
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {mediaType === 'movie' ? (
                <>
                  <Film className="h-3 w-3" />
                  Película
                </>
              ) : (
                <>
                  <Tv className="h-3 w-3" />
                  Serie
                </>
              )}
            </div>
            {/* Rating Badge */}
            {rating > 0 && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-yellow-400 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-current" />
                {rating.toFixed(1)}
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </div>
              {rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Skeleton loader para MediaCard
 */
export function MediaCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <Skeleton className="aspect-[2/3] w-full" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
