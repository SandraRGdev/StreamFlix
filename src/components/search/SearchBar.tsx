// ============================================
// Search Bar Component
// ============================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/lib/hooks';
import type { MediaType } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Componente SearchBar - Barra de búsqueda con autocompletado
 */
export function SearchBar({
  placeholder = 'Buscar películas, series...',
  className,
  autoFocus = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useSearch({
    query,
    mediaType: 'all',
    enabled: query.length >= 2,
  });

  // Actualizar posición del dropdown cuando se abre
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      });
    } else {
      setDropdownStyle(null);
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer clic fuera o al presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node) &&
        !containerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Manejar submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  // Manejar selección de sugerencia
  const handleSelectSuggestion = (id: number, mediaType: MediaType) => {
    navigate(`/${mediaType}/${id}`);
    setIsOpen(false);
    setQuery('');
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Filtrar resultados para autocompletado (máximo 5)
  const suggestions = data?.data?.slice(0, 5) || [];

  return (
    <>
      <div className={cn('relative', className)} ref={containerRef}>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length > 0);
            }}
            onFocus={() => setIsOpen(query.length > 0)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Dropdown - renderizado con fixed positioning */}
      {isOpen && dropdownStyle && (
        <div ref={dropdownRef} style={dropdownStyle}>
          {/* Dropdown de sugerencias */}
          {suggestions.length > 0 && (
            <div className="bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.id, item.media_type)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                  >
                    {/* Poster */}
                    <img
                      src={item.poster_path}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{item.title}</p>
                        <span
                          className={cn(
                            'flex-shrink-0 text-xs px-1.5 py-0.5 rounded',
                            item.media_type === 'movie'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-purple-500/20 text-purple-300'
                          )}
                        >
                          {item.media_type === 'movie' ? (
                            <>
                              <Film className="h-3 w-3 inline mr-0.5" />
                              Película
                            </>
                          ) : (
                            <>
                              <Tv className="h-3 w-3 inline mr-0.5" />
                              Serie
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.year}</p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Ver todos los resultados */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full p-3 text-sm text-muted-foreground hover:bg-muted transition-colors border-t border-border"
              >
                Ver todos los resultados para "{query}"
              </button>
            </div>
          )}

          {/* Loading indicator */}
          {loading && suggestions.length === 0 && (
            <div className="bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
              Buscando...
            </div>
          )}

          {/* No results */}
          {!loading && suggestions.length === 0 && (
            <div className="bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </>
  );
}

/**
 * SearchBar simple sin autocompletado
 */
export function SimpleSearchBar({
  query,
  onQueryChange,
  className,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  className?: string;
}) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar películas, series..."
        className="pl-10"
      />
    </form>
  );
}
