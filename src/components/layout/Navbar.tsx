// ============================================
// Navbar Component
// ============================================

import { Link, useLocation } from 'react-router-dom';
import { Film, Tv, TrendingUp, Star, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_GENRES } from '@/lib/tmdb';

export interface NavbarProps {
  mediaType?: 'movie' | 'tv';
  className?: string;
}

/**
 * Componente Navbar - Barra de navegación secundaria con categorías
 */
export function Navbar({ mediaType = 'movie', className }: NavbarProps) {
  const location = useLocation();

  const categories =
    mediaType === 'movie'
      ? [
          { name: 'Populares', path: '/movies/popular', icon: Flame },
          { name: 'En cartelera', path: '/movies/now-playing', icon: Film },
          { name: 'Mejor valoradas', path: '/movies/top-rated', icon: Star },
          { name: 'Tendencias', path: '/movies/trending', icon: TrendingUp },
        ]
      : [
          { name: 'Populares', path: '/tv/popular', icon: Flame },
          { name: 'Al aire hoy', path: '/tv/airing-today', icon: Tv },
          { name: 'Mejor valoradas', path: '/tv/top-rated', icon: Star },
          { name: 'Tendencias', path: '/tv/trending', icon: TrendingUp },
        ];

  return (
    <nav
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar py-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = location.pathname === category.path;

            return (
              <Link
                key={category.path}
                to={category.path}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Navbar de géneros
 */
export function GenreNavbar({ mediaType = 'movie', className }: { mediaType?: 'movie' | 'tv'; className?: string }) {
  const location = useLocation();
  const genres = DEFAULT_GENRES[mediaType];

  return (
    <nav
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-3">
          <Link
            to={`/${mediaType}s`}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
              location.pathname === `/${mediaType}s`
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground'
            )}
          >
            Todos
          </Link>
          {genres.slice(0, 12).map((genre) => (
            <Link
              key={genre.id}
              to={`/${mediaType}s/genre/${genre.id}`}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                location.pathname === `/${mediaType}s/genre/${genre.id}`
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              )}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
