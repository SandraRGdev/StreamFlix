// ============================================
// TMDB API - Popular Hook
// ============================================

import { tmdbClient, TMDB_ENDPOINTS, buildListParams, transformMovies, transformTVShows, CACHE_TIMES, type MediaType, type MediaListResponse } from '../tmdb';
import { useTMDBParams } from './useTMDB';

export interface UsePopularOptions {
  mediaType: MediaType;
  page?: number;
  language?: string;
  enabled?: boolean;
}

export type UsePopularResult = ReturnType<typeof usePopular>;

/**
 * Hook para obtener contenido popular de TMDB
 * @param options - Opciones de configuración
 * @returns Resultado con lista de media
 *
 * @example
 * const { data, loading, error } = usePopular({
 *   mediaType: 'movie'
 * });
 */
export function usePopular(options: UsePopularOptions) {
  const {
    mediaType,
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const fetcher = async (params: { mediaType: MediaType; page: number; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.popularMovies()
      : TMDB_ENDPOINTS.popularTV();

    const requestParams = buildListParams(params.page, params.language);

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.popular,
    });

    const transformed = params.mediaType === 'movie'
      ? transformMovies(response.results)
      : transformTVShows(response.results);

    return {
      data: transformed,
      meta: {
        page: response.page,
        total_results: response.total_results,
        total_pages: response.total_pages,
      },
    } as MediaListResponse;
  };

  return useTMDBParams<MediaListResponse, { mediaType: MediaType; page: number; language: string }>(
    fetcher,
    { mediaType, page, language },
    { enabled }
  );
}

/**
 * Hook para obtener películas populares
 */
export function usePopularMovies(options: Omit<UsePopularOptions, 'mediaType'> = {}) {
  return usePopular({
    ...options,
    mediaType: 'movie',
  });
}

/**
 * Hook para obtener series populares
 */
export function usePopularTV(options: Omit<UsePopularOptions, 'mediaType'> = {}) {
  return usePopular({
    ...options,
    mediaType: 'tv',
  });
}

// ============================================
// Top Rated
// ============================================

export interface UseTopRatedOptions {
  mediaType: MediaType;
  page?: number;
  language?: string;
  enabled?: boolean;
}

export function useTopRated(options: UseTopRatedOptions) {
  const {
    mediaType,
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const fetcher = async (params: { mediaType: MediaType; page: number; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.topRatedMovies()
      : TMDB_ENDPOINTS.topRatedTV();

    const requestParams = buildListParams(params.page, params.language);

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.popular,
    });

    const transformed = params.mediaType === 'movie'
      ? transformMovies(response.results)
      : transformTVShows(response.results);

    return {
      data: transformed,
      meta: {
        page: response.page,
        total_results: response.total_results,
        total_pages: response.total_pages,
      },
    } as MediaListResponse;
  };

  return useTMDBParams<MediaListResponse, { mediaType: MediaType; page: number; language: string }>(
    fetcher,
    { mediaType, page, language },
    { enabled }
  );
}

/**
 * Hook para obtener películas top rated
 */
export function useTopRatedMovies(options: Omit<UseTopRatedOptions, 'mediaType'> = {}) {
  return useTopRated({
    ...options,
    mediaType: 'movie',
  });
}

/**
 * Hook para obtener series top rated
 */
export function useTopRatedTV(options: Omit<UseTopRatedOptions, 'mediaType'> = {}) {
  return useTopRated({
    ...options,
    mediaType: 'tv',
  });
}

// ============================================
// Now Playing / On The Air
// ============================================

export interface UseNowPlayingOptions {
  page?: number;
  language?: string;
  enabled?: boolean;
}

/**
 * Hook para obtener películas en cartelera
 */
export function useNowPlaying(options: UseNowPlayingOptions = {}) {
  const {
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const fetcher = async (params: { page: number; language: string }) => {
    const endpoint = TMDB_ENDPOINTS.nowPlayingMovies();
    const requestParams = buildListParams(params.page, params.language);

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.popular,
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
  };

  return useTMDBParams(fetcher, { page, language }, { enabled });
}

/**
 * Hook para obtener series al aire
 */
export function useOnTheAir(options: UseNowPlayingOptions = {}) {
  const {
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const fetcher = async (params: { page: number; language: string }) => {
    const endpoint = TMDB_ENDPOINTS.onTheAirTV();
    const requestParams = buildListParams(params.page, params.language);

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.popular,
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
  };

  return useTMDBParams(fetcher, { page, language }, { enabled });
}
