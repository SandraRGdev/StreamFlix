// ============================================
// TMDB API - Media Detail Hook
// ============================================

import { tmdbClient, TMDB_ENDPOINTS, buildDetailParams, transformMovieDetails, transformTVDetails, transformMovie, transformTVShow, CACHE_TIMES, buildYouTubeThumbnail, type MediaType, type MediaDetailResponse } from '../tmdb';
import { useTMDBParams } from './useTMDB';

export interface UseMediaDetailOptions {
  id: number | null;
  mediaType?: MediaType;
  language?: string;
  enabled?: boolean;
}

export type UseMediaDetailResult = ReturnType<typeof useMediaDetail>;

/**
 * Hook para obtener detalles de una película o serie
 * @param options - Opciones de configuración
 * @returns Resultado con detalles de media
 *
 * @example
 * const { data, loading, error } = useMediaDetail({
 *   id: 123,
 *   mediaType: 'movie'
 * });
 */
export function useMediaDetail(options: UseMediaDetailOptions) {
  const {
    id,
    mediaType = 'movie',
    language = 'es-ES',
    enabled = true,
  } = options;

  // Solo está habilitado si hay un ID
  const isEnabled = enabled && id !== null && id !== undefined;

  const fetcher = async (params: { id: number; mediaType: MediaType; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.movieDetails(params.id)
      : TMDB_ENDPOINTS.tvDetails(params.id);

    const requestParams = buildDetailParams(
      ['videos', 'credits', 'similar'],
      params.language
    );

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });

    const transformed = params.mediaType === 'movie'
      ? transformMovieDetails(response)
      : transformTVDetails(response);

    return {
      data: transformed,
    } as MediaDetailResponse;
  };

  return useTMDBParams<MediaDetailResponse, { id: number; mediaType: MediaType; language: string }>(
    fetcher,
    { id: id!, mediaType, language },
    { enabled: isEnabled }
  );
}

/**
 * Hook para obtener detalles de película
 */
export function useMovieDetail(options: Omit<UseMediaDetailOptions, 'mediaType'>) {
  return useMediaDetail({
    ...options,
    mediaType: 'movie',
  });
}

/**
 * Hook para obtener detalles de serie
 */
export function useTVDetail(options: Omit<UseMediaDetailOptions, 'mediaType'>) {
  return useMediaDetail({
    ...options,
    mediaType: 'tv',
  });
}

// ============================================
// Credits
// ============================================

export interface UseCreditsOptions {
  id: number | null;
  mediaType: MediaType;
  language?: string;
  enabled?: boolean;
}

/**
 * Hook para obtener créditos (cast y crew)
 */
export function useCredits(options: UseCreditsOptions) {
  const {
    id,
    mediaType,
    language = 'es-ES',
    enabled = true,
  } = options;

  const isEnabled = enabled && id !== null && id !== undefined;

  const fetcher = async (params: { id: number; mediaType: MediaType; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.movieCredits(params.id)
      : TMDB_ENDPOINTS.tvCredits(params.id);

    const requestParams = { language: params.language };

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });

    return {
      cast: response.cast?.map((c: any) => ({
        id: c.id,
        character: c.character,
        name: c.name,
        profile_path: c.profile_path,
      })) || [],
      crew: response.crew?.map((c: any) => ({
        id: c.id,
        department: c.department,
        job: c.job,
        name: c.name,
        profile_path: c.profile_path,
      })) || [],
    };
  };

  return useTMDBParams<any, { id: number; mediaType: MediaType; language: string }>(
    fetcher,
    { id: id!, mediaType, language },
    { enabled: isEnabled }
  );
}

// ============================================
// Videos
// ============================================

export interface UseVideosOptions {
  id: number | null;
  mediaType: MediaType;
  language?: string;
  enabled?: boolean;
}

/**
 * Hook para obtener videos de una película o serie
 */
export function useVideos(options: UseVideosOptions) {
  const {
    id,
    mediaType,
    language = 'es-ES',
    enabled = true,
  } = options;

  const isEnabled = enabled && id !== null && id !== undefined;

  const fetcher = async (params: { id: number; mediaType: MediaType; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.movieVideos(params.id)
      : TMDB_ENDPOINTS.tvVideos(params.id);

    const requestParams = { language: params.language };

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });

    return response.results?.map((v: any) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      type: v.type,
      official: v.official,
      site: v.site,
      thumbnail: buildYouTubeThumbnail(v.key),
    })) || [];
  };

  return useTMDBParams<any, { id: number; mediaType: MediaType; language: string }>(
    fetcher,
    { id: id!, mediaType, language },
    { enabled: isEnabled }
  );
}

// ============================================
// Similar / Recommendations
// ============================================

export interface UseSimilarOptions {
  id: number | null;
  mediaType: MediaType;
  page?: number;
  language?: string;
  enabled?: boolean;
}

/**
 * Hook para obtener contenido similar
 */
export function useSimilar(options: UseSimilarOptions) {
  const {
    id,
    mediaType,
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const isEnabled = enabled && id !== null && id !== undefined;

  const fetcher = async (params: { id: number; mediaType: MediaType; page: number; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.movieSimilar(params.id)
      : TMDB_ENDPOINTS.tvSimilar(params.id);

    const requestParams = {
      page: params.page,
      language: params.language,
    };

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });

    // Transformar usando los transformers existentes
    const transformed = params.mediaType === 'movie'
      ? response.results?.map((r: any) => transformMovie({ ...r, media_type: 'movie' })) || []
      : response.results?.map((r: any) => transformTVShow({ ...r, media_type: 'tv' })) || [];

    return {
      data: transformed,
      meta: {
        page: response.page,
        total_results: response.total_results,
        total_pages: response.total_pages,
      },
    };
  };

  return useTMDBParams<any, { id: number; mediaType: MediaType; page: number; language: string }>(
    fetcher,
    { id: id!, mediaType, page, language },
    { enabled: isEnabled }
  );
}

/**
 * Hook para obtener recomendaciones
 */
export function useRecommendations(options: UseSimilarOptions) {
  const {
    id,
    mediaType,
    page = 1,
    language = 'es-ES',
    enabled = true,
  } = options;

  const isEnabled = enabled && id !== null && id !== undefined;

  const fetcher = async (params: { id: number; mediaType: MediaType; page: number; language: string }) => {
    const endpoint = params.mediaType === 'movie'
      ? TMDB_ENDPOINTS.movieRecommendations(params.id)
      : TMDB_ENDPOINTS.tvRecommendations(params.id);

    const requestParams = {
      page: params.page,
      language: params.language,
    };

    const response = await tmdbClient.get<any>(endpoint, requestParams, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });

    // Transformar usando los transformers existentes
    const transformed = params.mediaType === 'movie'
      ? response.results?.map((r: any) => transformMovie({ ...r, media_type: 'movie' })) || []
      : response.results?.map((r: any) => transformTVShow({ ...r, media_type: 'tv' })) || [];

    return {
      data: transformed,
      meta: {
        page: response.page,
        total_results: response.total_results,
        total_pages: response.total_pages,
      },
    };
  };

  return useTMDBParams<any, { id: number; mediaType: MediaType; page: number; language: string }>(
    fetcher,
    { id: id!, mediaType, page, language },
    { enabled: isEnabled }
  );
}
