// ============================================
// Hero Section Component
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Media } from '@/lib/tmdb';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaRating } from '@/components/media/MediaRating';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  media?: Media[];
  autoPlayInterval?: number;
  className?: string;
}

/**
 * Componente HeroSection - Sección hero destacada con carrusel automático
 */
export function HeroSection({
  media = [],
  autoPlayInterval = 8000,
  className,
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Solo mostrar media con backdrop
  const featuredMedia = media.filter((m) => m.backdrop_path && m.overview);
  const currentItem = featuredMedia[currentIndex];

  // Auto-play
  useEffect(() => {
    if (featuredMedia.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === featuredMedia.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, featuredMedia.length, autoPlayInterval]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? featuredMedia.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === featuredMedia.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToIndex = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Si no hay contenido destacado, no renderizar nada
  if (featuredMedia.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        'relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden',
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentItem.backdrop_path}
          alt={currentItem.title}
          className={cn(
            'h-full w-full object-cover transition-transform duration-700',
            isTransitioning ? 'scale-105' : 'scale-100'
          )}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4">
          {/* Media Type Badge */}
          <Badge
            variant="secondary"
            className={cn(
              'capitalize text-sm px-3 py-1',
              currentItem.media_type === 'movie'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-purple-500/20 text-purple-300'
            )}
          >
            {currentItem.media_type === 'movie' ? 'Película' : 'Serie'}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            {currentItem.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
            <MediaRating rating={currentItem.vote_average} variant="star" />
            <span>{currentItem.year}</span>
            {currentItem.runtime && <span>{currentItem.runtime} min</span>}
            {currentItem.number_of_seasons && (
              <span>{currentItem.number_of_seasons} temporadas</span>
            )}
          </div>

          {/* Overview */}
          <p className="text-base text-white/80 line-clamp-3 drop-shadow-md">
            {currentItem.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link to={`/${currentItem.media_type}/${currentItem.id}`}>
                <Play className="mr-2 h-5 w-5 fill-current" />
                Reproducir
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              <Link to={`/${currentItem.media_type}/${currentItem.id}`}>
                <Info className="mr-2 h-5 w-5" />
                Más información
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredMedia.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {featuredMedia.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Hero estático (sin carrusel)
 */
export function StaticHero({ media, className }: { media?: Media; className?: string }) {
  if (!media) return null;

  return (
    <section
      className={cn(
        'relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0">
        <img
          src={media.backdrop_path}
          alt={media.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4">
          <Badge
            variant="secondary"
            className={cn(
              'capitalize',
              media.media_type === 'movie'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-purple-500/20 text-purple-300'
            )}
          >
            {media.media_type === 'movie' ? 'Película' : 'Serie'}
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            {media.title}
          </h1>

          <p className="text-base text-white/80 line-clamp-3 drop-shadow-md">
            {media.overview}
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link to={`/${media.media_type}/${media.id}`}>
              <Play className="mr-2 h-5 w-5 fill-current" />
              Ver ahora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
