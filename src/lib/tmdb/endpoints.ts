// ============================================
// TMDB API - Endpoints Definition
// ============================================

import type { MediaType } from './types';
import type { TimeWindow } from './config';

/**
 * Construye la URL base del endpoint
 */
function buildEndpoint(path: string): string {
  return path;
}

/**
 * Añade parámetros de query a la URL
 */
function buildQuery(params: Record<string, any>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Combina endpoint y parámetros
 */
export function buildUrl(endpoint: string, params: Record<string, any> = {}): string {
  const query = buildQuery(params);
  return `${endpoint}${query}`;
}

// ============================================
// Endpoint Builders
// ============================================

export const TMDB_ENDPOINTS = {
  // ==========================================
  // Trending
  // ==========================================
  trending: (mediaType: 'all' | MediaType, timeWindow: TimeWindow) =>
    buildEndpoint(`/trending/${mediaType}/${timeWindow}`),

  // ==========================================
  // Popular / Top Rated
  // ==========================================
  popularMovies: () => buildEndpoint('/movie/popular'),
  popularTV: () => buildEndpoint('/tv/popular'),
  topRatedMovies: () => buildEndpoint('/movie/top_rated'),
  topRatedTV: () => buildEndpoint('/tv/top_rated'),
  upcomingMovies: () => buildEndpoint('/movie/upcoming'),
  nowPlayingMovies: () => buildEndpoint('/movie/now_playing'),
  onTheAirTV: () => buildEndpoint('/tv/on_the_air'),
  airingTodayTV: () => buildEndpoint('/tv/airing_today'),

  // ==========================================
  // Search
  // ==========================================
  searchMovie: () => buildEndpoint('/search/movie'),
  searchTV: () => buildEndpoint('/search/tv'),
  searchMulti: () => buildEndpoint('/search/multi'),

  // ==========================================
  // Details
  // ==========================================
  movieDetails: (id: number) => buildEndpoint(`/movie/${id}`),
  tvDetails: (id: number) => buildEndpoint(`/tv/${id}`),
  personDetails: (id: number) => buildEndpoint(`/person/${id}`),
  personCombinedCredits: (id: number) => buildEndpoint(`/person/${id}/combined_credits`),

  // ==========================================
  // Additional Data
  // ==========================================
  movieCredits: (id: number) => buildEndpoint(`/movie/${id}/credits`),
  tvCredits: (id: number) => buildEndpoint(`/tv/${id}/credits`),
  movieVideos: (id: number) => buildEndpoint(`/movie/${id}/videos`),
  tvVideos: (id: number) => buildEndpoint(`/tv/${id}/videos`),
  movieSimilar: (id: number) => buildEndpoint(`/movie/${id}/similar`),
  tvSimilar: (id: number) => buildEndpoint(`/tv/${id}/similar`),
  movieRecommendations: (id: number) => buildEndpoint(`/movie/${id}/recommendations`),
  tvRecommendations: (id: number) => buildEndpoint(`/tv/${id}/recommendations`),

  // ==========================================
  // Discover
  // ==========================================
  discoverMovie: () => buildEndpoint('/discover/movie'),
  discoverTV: () => buildEndpoint('/discover/tv'),

  // ==========================================
  // Genres
  // ==========================================
  movieGenres: () => buildEndpoint('/genre/movie/list'),
  tvGenres: () => buildEndpoint('/genre/tv/list'),

  // ==========================================
  // Configuration
  // ==========================================
  configuration: () => buildEndpoint('/configuration'),
} as const;

// ============================================
// Parámetros comunes
// ============================================

export const COMMON_PARAMS = {
  language: 'es-ES',
  include_image_language: 'es,null',
  include_adult: false,
  include_video: false,
} as const;

/**
 * Construye parámetros para lista (paginación)
 */
export function buildListParams(page: number = 1, language: string = 'es-ES') {
  return {
    ...COMMON_PARAMS,
    page,
    language,
  };
}

/**
 * Construye parámetros para búsqueda
 */
export function buildSearchParams(
  query: string,
  page: number = 1,
  language: string = 'es-ES',
  includeAdult: boolean = false
) {
  return {
    ...COMMON_PARAMS,
    query,
    page,
    language,
    include_adult: includeAdult,
  };
}

/**
 * Construye parámetros para discover
 */
export function buildDiscoverParams(params: {
  page?: number;
  language?: string;
  sortBy?: string;
  withGenres?: string;
  withOriginalLanguage?: string;
  voteAverageGte?: number;
  voteAverageLte?: number;
  releaseDateGte?: string;
  releaseDateLte?: string;
  firstAirDateGte?: string;
  firstAirDateLte?: string;
  withRuntimeGte?: number;
  withRuntimeLte?: number;
}) {
  return {
    ...buildListParams(params.page, params.language),
    sort_by: params.sortBy || 'popularity.desc',
    with_genres: params.withGenres,
    with_original_language: params.withOriginalLanguage,
    'vote_average.gte': params.voteAverageGte,
    'vote_average.lte': params.voteAverageLte,
    'release_date.gte': params.releaseDateGte,
    'release_date.lte': params.releaseDateLte,
    'first_air_date.gte': params.firstAirDateGte,
    'first_air_date.lte': params.firstAirDateLte,
    'with_runtime.gte': params.withRuntimeGte,
    'with_runtime.lte': params.withRuntimeLte,
  };
}

/**
 * Construye parámetros para detalles con append
 */
export function buildDetailParams(
  append: string[] = ['videos', 'credits', 'similar'],
  language: string = 'es-ES'
) {
  return {
    language,
    append_to_response: append.join(','),
  };
}

/**
 * Combina endpoint con parámetros
 */
export function getUrl(
  endpoint: string,
  params: Record<string, any> = {}
): string {
  return buildUrl(endpoint, params);
}
