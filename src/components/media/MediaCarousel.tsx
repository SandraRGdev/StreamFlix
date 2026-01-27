// ============================================
// Media Carousel Component
// ============================================

import { useRef, useState, useEffect } from 'react';
import type { Media } from '@/lib/tmdb';
import { MediaCard } from './MediaCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MediaCarouselProps {
  title?: string;
  media?: Media[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  showArrows?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

/**
 * Componente MediaCarousel - Carrusel horizontal de media
 */
export function MediaCarousel({
  title,
  media = [],
  loading = false,
  error = null,
  className,
  showArrows = true,
  autoplay = false,
  autoplayInterval = 5000,
}: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Actualizar estado de scroll
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    updateScrollState();

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [media]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || media.length === 0 || loading) return;

    const interval = setInterval(() => {
      if (canScrollRight) {
        scrollRight();
      } else {
        scrollToStart();
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, canScrollRight, media, loading]);

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width || 200;
    el.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = (el.firstElementChild as HTMLElement)?.getBoundingClientRect().width || 200;
    el.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
  };

  const scrollToStart = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ left: 0, behavior: 'smooth' });
  };

  // Error state
  if (error) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header con título y flechas */}
      {title && (
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
          {showArrows && !loading && media.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Carrusel */}
      <div className="relative group">
        {/* Gradient fades - solo en pantallas grandes */}
        <div className={cn(
          'hidden sm:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300',
          !canScrollLeft && 'opacity-0'
        )} />
        <div className={cn(
          'hidden sm:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300',
          !canScrollRight && 'opacity-0'
        )} />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex-shrink-0 w-[160px] md:w-[200px]"
                >
                  <div className="animate-pulse">
                    <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            : media.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
                >
                  <MediaCard media={item} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Carrusel compacto para secciones secundarias
 */
export function MediaCarouselCompact(props: MediaCarouselProps) {
  return <MediaCarousel {...props} className={cn('space-y-2', props.className)} />;
}
