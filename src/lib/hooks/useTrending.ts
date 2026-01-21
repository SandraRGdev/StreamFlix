// ============================================
// TMDB API - Trending Hook
// ============================================

import { tmdbClient, TMDB_ENDPOINTS, buildListParams, transformMovies, transformTVShows, transformMultiSearchResults, CACHE_TIMES, type MediaType, type TimeWindow, type MediaListResponse } from '../tmdb';
import { useTMDBParams } from './useTMDB';

export interface UseTrendingOptions {
  mediaType?: 'all' | MediaType;
  timeWindow?: TimeWindow;
  page?: number;
  language?: string;
  enabled?: boolean;
}

export type UseTrendingResult = ReturnType<typeof useTrending>;

/**
 * Hook para obtener contenido trending de TMDB
 * @param options - Opciones de configuración
 * @returns Resultado con lista de media
 *
 * @example
 * const { data, loading, error } = useTrending({
 *   mediaType: 'all',
 *   timeWindow: 'week'
 * });
 */
export function useTrending(options: UseTrendingOptions = {}) {
  const {
    mediaType = 'all',
    timeWindow = 'week',
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const fetcher = async (params: { mediaType: 'all' | MediaType; timeWindow: TimeWindow; page: number; language: string }) => {
    const endpoint = TMDB_ENDPOINTS.trending(params.mediaType, params.timeWindow);
    const requestParams = buildListParams(params.page, params.language);

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.trending,
    });

    // Transformar resultados según media_type
    let transformedData: MediaListResponse;
    if (params.mediaType === 'all') {
      const transformed = transformMultiSearchResults(response.results);
      transformedData = {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      };
    } else if (params.mediaType === 'movie') {
      const transformed = transformMovies(response.results);
      transformedData = {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      };
    } else {
      const transformed = transformTVShows(response.results);
      transformedData = {
        data: transformed,
        meta: {
          page: response.page,
          total_results: response.total_results,
          total_pages: response.total_pages,
        },
      };
    }

    return transformedData;
  };

  return useTMDBParams<MediaListResponse, { mediaType: 'all' | MediaType; timeWindow: TimeWindow; page: number; language: string }>(
    fetcher,
    { mediaType, timeWindow, page, language },
    { enabled }
  );
}

/**
 * Hook para obtener películas trending
 */
export function useTrendingMovies(options: Omit<UseTrendingOptions, 'mediaType'> = {}) {
  return useTrending({
    ...options,
    mediaType: 'movie',
  });
}

/**
 * Hook para obtener series trending
 */
export function useTrendingTV(options: Omit<UseTrendingOptions, 'mediaType'> = {}) {
  return useTrending({
    ...options,
    mediaType: 'tv',
  });
}
