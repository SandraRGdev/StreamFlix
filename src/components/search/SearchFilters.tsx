// ============================================
// Search Filters Component
// ============================================

import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { DEFAULT_GENRES, SUPPORTED_LANGUAGES, SORT_OPTIONS } from '@/lib/tmdb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface SearchFiltersProps {
  mediaType: 'movie' | 'tv';
  className?: string;
}

export interface FilterState {
  genre?: number;
  year?: number;
  rating?: number;
  language?: string;
  sortBy?: string;
}

/**
 * Componente SearchFilters - Panel de filtros avanzados
 */
export function SearchFilters({ mediaType, className }: SearchFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Leer filtros actuales de URL
  const currentFilters: FilterState = {
    genre: searchParams.get('genre') ? parseInt(searchParams.get('genre')!) : undefined,
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    language: searchParams.get('language') || undefined,
    sortBy: searchParams.get('sort') || undefined,
  };

  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;

  const genres = DEFAULT_GENRES[mediaType];

  // Aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.genre) params.set('genre', filters.genre.toString());
    if (filters.year) params.set('year', filters.year.toString());
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.language) params.set('language', filters.language);
    if (filters.sortBy) params.set('sort', filters.sortBy);

    // Mantener query de búsqueda si existe
    const query = searchParams.get('q');
    if (query) params.set('q', query);

    navigate(`/search?${params.toString()}`);
    setOpen(false);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) params.set('q', query);

    navigate(`/search?${params.toString()}`);
    setFilters({});
    setOpen(false);
  };

  // Limpiar un filtro específico
  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...currentFilters };
    delete newFilters[key];

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });

    const query = searchParams.get('q');
    if (query) params.set('q', query);

    navigate(`/search?${params.toString()}`);
  };

  // Obtener nombre del género
  const getGenreName = (genreId: number) => {
    return genres.find((g) => g.id === genreId)?.name || genreId.toString();
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {currentFilters.genre && (
            <Badge variant="secondary" className="gap-1">
              Género: {getGenreName(currentFilters.genre)}
              <button
                onClick={() => clearFilter('genre')}
                className="hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.year && (
            <Badge variant="secondary" className="gap-1">
              Año: {currentFilters.year}
              <button
                onClick={() => clearFilter('year')}
                className="hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.rating && (
            <Badge variant="secondary" className="gap-1">
              Rating ≥ {currentFilters.rating}
              <button
                onClick={() => clearFilter('rating')}
                className="hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentFilters.language && (
            <Badge variant="secondary" className="gap-1">
              {SUPPORTED_LANGUAGES.find((l) => l.code === currentFilters.language)?.name}
              <button
                onClick={() => clearFilter('language')}
                className="hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar todos
          </Button>
        </div>
      )}

      {/* Filters Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filtros de búsqueda</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Género */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Género</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!filters.genre ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({ ...filters, genre: undefined })}
                >
                  Todos
                </Button>
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant={filters.genre === genre.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, genre: genre.id })}
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Año */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Año mínimo: {filters.year || 'Cualquiera'}
              </label>
              <Slider
                value={[filters.year || new Date().getFullYear() - 50]}
                min={1950}
                max={new Date().getFullYear() + 2}
                step={1}
                onValueChange={([value]) => setFilters({ ...filters, year: value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1950</span>
                <span>{new Date().getFullYear() + 2}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Rating mínimo: {filters.rating || 'Cualquiera'}
              </label>
              <Slider
                value={[filters.rating || 0]}
                min={0}
                max={10}
                step={0.5}
                onValueChange={([value]) => setFilters({ ...filters, rating: value })}
                className="w-full"
              />
            </div>

            {/* Idioma */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Idioma original</label>
              <select
                value={filters.language || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    language: e.target.value || undefined,
                  })
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Cualquiera</option>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Ordenar por</label>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, sortBy: option.value })}
                    className="justify-start text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={clearFilters} variant="outline" className="flex-1">
                Limpiar
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Aplicar filtros
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
