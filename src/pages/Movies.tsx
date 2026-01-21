// ============================================
// Movies Page
// ============================================

import { Header, HeaderSpacer, Navbar } from '@/components/layout';
import { MediaGrid } from '@/components/media';
import { SearchFilters } from '@/components/search';
import { usePopularMovies, useTopRatedMovies, useNowPlaying, useTrendingMovies } from '@/lib/hooks';
import { useLocation } from 'react-router-dom';

/**
 * Página de películas - detecta la categoría de la ruta
 */
export function MoviesPage() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const category = pathSegments[2] || null; // null para /movies, 'popular' para /movies/popular, etc.

  // Determinar qué datos cargar según la ruta
  const shouldLoadPopular = !category || category === 'popular';
  const shouldLoadNowPlaying = category === 'now-playing' || category === 'now_playing';
  const shouldLoadTopRated = category === 'top-rated' || category === 'top_rated';
  const shouldLoadTrending = category === 'trending';

  // Solo cargar lo que se necesita
  const popular = usePopularMovies({ page: 1, enabled: shouldLoadPopular });
  const nowPlaying = useNowPlaying({ page: 1, enabled: shouldLoadNowPlaying });
  const topRated = useTopRatedMovies({ page: 1, enabled: shouldLoadTopRated });
  const trending = useTrendingMovies({ timeWindow: 'week', enabled: shouldLoadTrending });

  // Seleccionar los datos a mostrar según la categoría
  let displayData, title, emptyMessage;

  if (category === 'now-playing' || category === 'now_playing') {
    displayData = nowPlaying;
    title = 'Películas en Cartelera';
    emptyMessage = 'No hay películas en cartelera';
  } else if (category === 'top-rated' || category === 'top_rated') {
    displayData = topRated;
    title = 'Mejor Películas';
    emptyMessage = 'No hay películas mejor valoradas';
  } else if (category === 'trending') {
    displayData = trending;
    title = 'Películas en Tendencia';
    emptyMessage = 'No hay películas en tendencia';
  } else {
    // Por defecto: populares
    displayData = popular;
    title = 'Películas Populares';
    emptyMessage = 'No hay películas populares';
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      <Navbar mediaType="movie" />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header con filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <SearchFilters mediaType="movie" />
        </div>

        {/* Grid de películas */}
        <MediaGrid
          media={displayData?.data?.data || []}
          loading={!displayData}
          emptyMessage={emptyMessage}
        />
      </main>
    </div>
  );
}
