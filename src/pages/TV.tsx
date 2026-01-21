// ============================================
// TV Series Page
// ============================================

import { Header, HeaderSpacer, Navbar } from '@/components/layout';
import { MediaGrid } from '@/components/media';
import { SearchFilters } from '@/components/search';
import { usePopularTV, useTopRatedTV, useOnTheAir, useTrendingTV } from '@/lib/hooks';
import { useLocation } from 'react-router-dom';

/**
 * Página de series - detecta la categoría de la ruta
 */
export function TVPage() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const category = pathSegments[2] || null;

  // Determinar qué datos cargar según la ruta
  const shouldLoadPopular = !category || category === 'popular';
  const shouldLoadOnTheAir = category === 'on-the-air' || category === 'on_the_air';
  const shouldLoadTopRated = category === 'top-rated' || category === 'top_rated';
  const shouldLoadTrending = category === 'trending';

  // Solo cargar lo que se necesita
  const popular = usePopularTV({ page: 1, enabled: shouldLoadPopular });
  const onTheAir = useOnTheAir({ page: 1, enabled: shouldLoadOnTheAir });
  const topRated = useTopRatedTV({ page: 1, enabled: shouldLoadTopRated });
  const trending = useTrendingTV({ timeWindow: 'week', enabled: shouldLoadTrending });

  // Seleccionar los datos a mostrar según la categoría
  let displayData, title, emptyMessage;

  if (category === 'on-the-air' || category === 'on_the_air') {
    displayData = onTheAir;
    title = 'Series al Aire Hoy';
    emptyMessage = 'No hay series al aire';
  } else if (category === 'top-rated' || category === 'top_rated') {
    displayData = topRated;
    title = 'Mejores Series';
    emptyMessage = 'No hay series mejor valoradas';
  } else if (category === 'trending') {
    displayData = trending;
    title = 'Series en Tendencia';
    emptyMessage = 'No hay series en tendencia';
  } else {
    // Por defecto: populares
    displayData = popular;
    title = 'Series Populares';
    emptyMessage = 'No hay series populares';
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeaderSpacer />

      <Navbar mediaType="tv" />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header con filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <SearchFilters mediaType="tv" />
        </div>

        {/* Grid de series */}
        <MediaGrid
          media={displayData?.data?.data || []}
          loading={!displayData}
          emptyMessage={emptyMessage}
        />
      </main>
    </div>
  );
}
