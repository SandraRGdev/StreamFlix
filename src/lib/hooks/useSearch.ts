// ============================================
// TMDB API - Search Hook
// ============================================

import { tmdbClient, TMDB_ENDPOINTS, buildSearchParams, transformMovies, transformTVShows, transformMultiSearchResults, CACHE_TIMES, type MediaType, type MediaListResponse } from '../tmdb';
import { useTMDBParams } from './useTMDB';

export interface UseSearchOptions {
  query: string;
  mediaType?: MediaType | 'all';
  page?: number;
  language?: string;
  includeAdult?: boolean;
  enabled?: boolean;
}

export type UseSearchResult = ReturnType<typeof useSearch>;

/**
 * Hook para buscar contenido en TMDB
 * @param options - Opciones de búsqueda
 * @returns Resultado con lista de media
 *
 * @example
 * const { data, loading, error } = useSearch({
 *   query: 'batman',
 *   mediaType: 'all'
 * });
 */
export function useSearch(options: UseSearchOptions) {
  const {
    query,
    mediaType = 'all',
    page = 1,
    language = 'es-ES',
    includeAdult = false,
    enabled = true,
  } = options;

  // La búsqueda solo está habilitada si hay un query
  const isEnabled = enabled && query.trim().length > 0;

  const fetcher = async (params: { query: string; mediaType: MediaType | 'all'; page: number; language: string; includeAdult: boolean }) => {
    let endpoint: string;
    let requestParams: Record<string, any>;

    if (params.mediaType === 'all') {
      endpoint = TMDB_ENDPOINTS.searchMulti();
      requestParams = buildSearchParams(params.query, params.page, params.language, params.includeAdult);

      const response = await tmdbClient.get<any>(endpoint, requestParams, {
        cache: true,
        cacheTTL: CACHE_TIMES.search,
      });

      const transformed = transformMultiSearchResults(response.results);

      return {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      } as MediaListResponse;
    } else if (params.mediaType === 'movie') {
      endpoint = TMDB_ENDPOINTS.searchMovie();
      requestParams = buildSearchParams(params.query, params.page, params.language, params.includeAdult);

      const response = await tmdbClient.get<any>(endpoint, requestParams, {
        cache: true,
        cacheTTL: CACHE_TIMES.search,
      });

      const transformed = transformMovies(response.results);

      return {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      } as MediaListResponse;
    } else {
      endpoint = TMDB_ENDPOINTS.searchTV();
      requestParams = buildSearchParams(params.query, params.page, params.language, params.includeAdult);

      const response = await tmdbClient.get<any>(endpoint, requestParams, {
        cache: true,
        cacheTTL: CACHE_TIMES.search,
      });

      const transformed = transformTVShows(response.results);

      return {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      } as MediaListResponse;
    }
  };

  return useTMDBParams<
    MediaListResponse,
    { query: string; mediaType: MediaType | 'all'; page: number; language: string; includeAdult: boolean }
  >(
    fetcher,
    { query, mediaType, page, language, includeAdult },
    { enabled: isEnabled }
  );
}

/**
 * Hook para buscar películas
 */
export function useSearchMovie(options: Omit<UseSearchOptions, 'mediaType'>) {
  return useSearch({
    ...options,
    mediaType: 'movie',
  });
}

/**
 * Hook para buscar series
 */
export function useSearchTV(options: Omit<UseSearchOptions, 'mediaType'>) {
  return useSearch({
    ...options,
    mediaType: 'tv',
  });
}

/**
 * Hook para búsqueda multi (películas y series)
 */
export function useSearchMulti(options: Omit<UseSearchOptions, 'mediaType'>) {
  return useSearch({
    ...options,
    mediaType: 'all',
  });
}

/**
 * Hook para búsqueda con debounce
 */
export function useDebouncedSearch(query: string, delay: number = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  return debouncedQuery;
}

// Import useState y useEffect si no están importados
import { useState, useEffect } from 'react';
