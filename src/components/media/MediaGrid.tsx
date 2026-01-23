// ============================================
// Media Grid Component
// ============================================

import type { Media } from '@/lib/tmdb';
import { MediaCard, MediaCardSkeleton } from './MediaCard';
import { cn } from '@/lib/utils';

export interface MediaGridProps {
  media?: Media[];
  loading?: boolean;
  error?: string | null;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
  emptyMessage?: string;
  skeletonCount?: number;
}

/**
 * Componente MediaGrid - Grid responsivo de tarjetas de media
 */
export function MediaGrid({
  media = [],
  loading = false,
  error = null,
  columns = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
  className,
  emptyMessage = 'No se encontraron resultados',
  skeletonCount = 12,
}: MediaGridProps) {
  // Construir clases de columnas
  const gridClasses = cn(
    'grid gap-4',
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    columns['2xl'] && `2xl:grid-cols-${columns['2xl']}`,
    className
  );

  // Estado de error
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MediaCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // Estado vacío
  if (media.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Renderizar grid
  return (
    <div className={gridClasses}>
      {media.map((item) => (
        <MediaCard key={`${item.media_type}-${item.id}`} media={item} />
      ))}
    </div>
  );
}

/**
 * Grid para películas
 */
export function MoviesGrid(props: Omit<MediaGridProps, 'columns'>) {
  return <MediaGrid {...props} columns={{ sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }} />;
}

/**
 * Grid para series
 */
export function TVGrid(props: Omit<MediaGridProps, 'columns'>) {
  return <MediaGrid {...props} columns={{ sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }} />;
}

/**
 * Grid más compacto (para secciones como "Más como esta")
 */
export function CompactGrid(props: Omit<MediaGridProps, 'columns'>) {
  return <MediaGrid {...props} columns={{ sm: 3, md: 4, lg: 5, xl: 6, '2xl': 8 }} />;
}
