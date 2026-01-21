// ============================================
// Search Results Component
// ============================================

import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/lib/hooks';
import { MediaGrid } from '@/components/media';
import { Button } from '@/components/ui/button';
import { Film, Tv, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchResultsProps {
  className?: string;
}

export type MediaTypeFilter = 'all' | 'movie' | 'tv';

/**
 * Componente SearchResults - Muestra resultados de búsqueda con filtros
 */
export function SearchResults({ className }: SearchResultsProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type');
  const mediaType = (typeParam === 'movie' || typeParam === 'tv' ? typeParam : 'all') as MediaTypeFilter;

  const { data, loading, error } = useSearch({
    query,
    mediaType,
    enabled: query.length > 0,
  });

  const results = data?.data || [];
  const totalResults = data?.meta?.total_results || 0;

  // Manejar cambio de tipo de filtro
  const handleTypeChange = (type: MediaTypeFilter) => {
    const params = new URLSearchParams({ q: query });
    if (type !== 'all') {
      params.set('type', type);
    }
    navigate(`/search?${params.toString()}`);
  };

  if (!query) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[400px]', className)}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Búsqueda</h2>
          <p className="text-muted-foreground">
            Ingresa el término que deseas buscar en la barra superior
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Resultados para "{query}"
            </h1>
            {totalResults > 0 && (
              <p className="text-sm text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
              </p>
            )}
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mediaType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('all')}
          >
            Todo
          </Button>
          <Button
            variant={mediaType === 'movie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('movie')}
          >
            <Film className="h-4 w-4 mr-1" />
            Películas
          </Button>
          <Button
            variant={mediaType === 'tv' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('tv')}
          >
            <Tv className="h-4 w-4 mr-1" />
            Series
          </Button>
        </div>
      </div>

      {/* Results */}
      <MediaGrid
        media={results}
        loading={loading}
        error={error}
        emptyMessage={`No se encontraron resultados para "${query}"`}
      />
    </div>
  );
}
