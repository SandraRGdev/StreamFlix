// ============================================
// Home Page
// ============================================

import { Header, HeaderSpacer, HeroSection } from '@/components/layout';
import { MediaCarousel } from '@/components/media';
import { useTrending, usePopularMovies, usePopularTV, useNowPlaying, useOnTheAir } from '@/lib/hooks';

/**
 * Página principal - Home
 */
export function HomePage() {
  // Trending (para hero)
  const { data: trendingData } = useTrending({
    mediaType: 'all',
    timeWindow: 'week',
  });

  // Populares
  const { data: popularMovies } = usePopularMovies({ page: 1 });
  const { data: popularTV } = usePopularTV({ page: 1 });

  // En cartelera / Al aire
  const { data: nowPlaying } = useNowPlaying({ page: 1 });
  const { data: onTheAir } = useOnTheAir({ page: 1 });

  const trendingMedia = trendingData?.data || [];
  const heroMedia = trendingMedia.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      {/* Hero Section */}
      <HeroSection media={heroMedia} />

      {/* Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Trending */}
        <MediaCarousel
          title="Tendencias"
          media={trendingMedia}
          loading={!trendingData}
        />

        {/* Películas en cartelera */}
        <MediaCarousel
          title="Películas en cartelera"
          media={nowPlaying?.data || []}
          loading={!nowPlaying}
        />

        {/* Películas populares */}
        <MediaCarousel
          title="Películas populares"
          media={popularMovies?.data || []}
          loading={!popularMovies}
        />

        {/* Series al aire */}
        <MediaCarousel
          title="Series al aire hoy"
          media={onTheAir?.data || []}
          loading={!onTheAir}
        />

        {/* Series populares */}
        <MediaCarousel
          title="Series populares"
          media={popularTV?.data || []}
          loading={!popularTV}
        />
      </main>
    </div>
  );
}
