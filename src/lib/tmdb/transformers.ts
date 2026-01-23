// ============================================
// TMDB API - Data Transformers & Normalizers
// ============================================

import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBMultiSearchResult,
  TMDBGenre,
  Media,
  MediaDetails,
} from './types';
import { buildImageUrl, buildYouTubeThumbnail } from './config';

// ============================================
// Extractores de campos comunes
// ============================================

/**
 * Extrae el año de la fecha de lanzamiento
 */
function extractYear(date: string | null): number | null {
  if (!date) return null;
  const year = parseInt(date.split('-')[0], 10);
  if (isNaN(year)) return null;
  return year;
}

/**
 * Extrae y normaliza los géneros
 */
function extractGenres(genres?: TMDBGenre[]): TMDBGenre[] | null {
  if (!genres || genres.length === 0) return null;
  return genres;
}

/**
 * Extrae el backdrop path construyendo URL completa
 */
function extractBackdropPath(path: string | null): string {
  return buildImageUrl(path, 'backdrop');
}

/**
 * Extrae el poster path construyendo URL completa
 */
function extractPosterPath(path: string | null): string {
  return buildImageUrl(path, 'poster');
}

/**
 * Valida y normaliza el overview
 */
function normalizeOverview(overview: string | null): string {
  if (!overview || overview.trim() === '') return '';
  return overview.trim();
}

/**
 * Normaliza el vote average
 */
function normalizeVoteAverage(rating: number | null): number {
  if (rating === null || isNaN(rating)) return 0;
  return Math.max(0, Math.min(10, rating));
}

// ============================================
// Transformadores principales
// ============================================

/**
 * Transforma una película de TMDB a nuestro modelo normalizado
 */
export function transformMovie(movie: TMDBMovie): Media {
  const releaseDate = movie.release_date || null;
  const year = extractYear(releaseDate);

  return {
    id: movie.id,
    tmdb_id: movie.id,
    media_type: 'movie',
    title: movie.title,
    original_title: movie.original_title,
    overview: normalizeOverview(movie.overview),
    poster_path: extractPosterPath(movie.poster_path),
    backdrop_path: extractBackdropPath(movie.backdrop_path),
    release_date: releaseDate || '',
    year: year || new Date().getFullYear(),
    vote_average: normalizeVoteAverage(movie.vote_average),
    vote_count: movie.vote_count || null,
    popularity: movie.popularity || null,
    genre_ids: movie.genre_ids || [],
    genres: null,
    original_language: movie.original_language || null,
    adult: movie.adult || false,
    video: movie.video || false,
    runtime: null,
  };
}

/**
 * Transforma una serie de TV de TMDB a nuestro modelo normalizado
 */
export function transformTVShow(tv: TMDBTVShow): Media {
  const firstAirDate = tv.first_air_date || null;
  const year = extractYear(firstAirDate);

  return {
    id: tv.id,
    tmdb_id: tv.id,
    media_type: 'tv',
    title: tv.name,
    original_title: tv.original_name,
    overview: normalizeOverview(tv.overview),
    poster_path: extractPosterPath(tv.poster_path),
    backdrop_path: extractBackdropPath(tv.backdrop_path),
    release_date: firstAirDate || '',
    year: year || new Date().getFullYear(),
    vote_average: normalizeVoteAverage(tv.vote_average),
    vote_count: tv.vote_count || null,
    popularity: tv.popularity || null,
    genre_ids: tv.genre_ids || [],
    genres: null,
    original_language: tv.original_language || null,
    adult: tv.adult || false,
    video: false,
    runtime: null,
    number_of_seasons: null,
    number_of_episodes: null,
    status: null,
  };
}

/**
 * Transforma un resultado de búsqueda multi a media
 */
export function transformMultiSearchResult(result: TMDBMultiSearchResult): Media | null {
  // Filtrar personas
  if (result.media_type === 'person') {
    return null;
  }

  const isMovie = result.media_type === 'movie';

  const baseData = {
    id: result.id,
    tmdb_id: result.id,
    media_type: result.media_type as 'movie' | 'tv',
    title: isMovie ? (result.title || '') : (result.name || ''),
    original_title: isMovie ? (result.original_title || '') : (result.original_name || ''),
    overview: normalizeOverview(result.overview),
    poster_path: extractPosterPath(result.poster_path),
    backdrop_path: extractBackdropPath(result.backdrop_path),
    release_date: isMovie ? (result.release_date || '') : (result.first_air_date || ''),
    year: extractYear(isMovie ? result.release_date || null : result.first_air_date || null) || new Date().getFullYear(),
    vote_average: normalizeVoteAverage(result.vote_average || null),
    vote_count: result.vote_count || null,
    popularity: result.popularity || null,
    genre_ids: result.genre_ids || [],
    genres: null,
    original_language: null,
    adult: result.adult || false,
    video: false,
    runtime: null,
  };

  if (isMovie) {
    return { ...baseData, media_type: 'movie' } as Media;
  } else {
    return {
      ...baseData,
      media_type: 'tv',
      number_of_seasons: null,
      number_of_episodes: null,
      status: null,
    } as Media;
  }
}

/**
 * Transforma detalles de película
 */
export function transformMovieDetails(movie: TMDBMovieDetails): MediaDetails {
  const base = transformMovie(movie);

  return {
    ...base,
    runtime: movie.runtime || null,
    status: movie.status || null,
    budget: movie.budget,
    revenue: movie.revenue,
    homepage: movie.homepage || undefined,
    imdb_id: movie.imdb_id || undefined,
    tagline: movie.tagline || undefined,
    genres: extractGenres(movie.genres),
    production_companies: movie.production_companies,
    spoken_languages: movie.spoken_languages,
    videos: movie.videos?.results?.map(v => ({
      id: v.id,
      key: v.key,
      name: v.name,
      type: v.type,
      official: v.official,
      site: v.site,
      thumbnail: buildYouTubeThumbnail(v.key),
    })) || [],
    cast: movie.credits?.cast?.map(c => ({
      id: c.id,
      character: c.character,
      name: c.name,
      profile_path: buildImageUrl(c.profile_path, 'profile'),
    })) || [],
    crew: movie.credits?.crew?.map(c => ({
      id: c.id,
      department: c.department,
      job: c.job,
      name: c.name,
      profile_path: buildImageUrl(c.profile_path, 'profile'),
    })) || [],
    similar: movie.similar?.results?.map(transformMovie) || [],
  };
}

/**
 * Transforma detalles de serie de TV
 */
export function transformTVDetails(tv: TMDBTVDetails): MediaDetails {
  const base = transformTVShow(tv);

  return {
    ...base,
    runtime: tv.episode_run_time?.[0] || null,
    status: tv.status || null,
    number_of_seasons: tv.number_of_seasons,
    number_of_episodes: tv.number_of_episodes,
    homepage: tv.homepage || undefined,
    tagline: tv.tagline || undefined,
    genres: extractGenres(tv.genres),
    production_companies: tv.production_companies,
    spoken_languages: tv.spoken_languages,
    seasons: tv.seasons?.map(s => ({
      ...s,
      poster_path: buildImageUrl(s.poster_path, 'poster'),
    })) || [],
    videos: tv.videos?.results?.map(v => ({
      id: v.id,
      key: v.key,
      name: v.name,
      type: v.type,
      official: v.official,
      site: v.site,
      thumbnail: buildYouTubeThumbnail(v.key),
    })) || [],
    cast: tv.credits?.cast?.map(c => ({
      id: c.id,
      character: c.character,
      name: c.name,
      profile_path: buildImageUrl(c.profile_path, 'profile'),
    })) || [],
    crew: tv.credits?.crew?.map(c => ({
      id: c.id,
      department: c.department,
      job: c.job,
      name: c.name,
      profile_path: buildImageUrl(c.profile_path, 'profile'),
    })) || [],
    similar: tv.similar?.results?.map(transformTVShow) || [],
  };
}

/**
 * Transforma un array de películas
 */
export function transformMovies(movies: TMDBMovie[]): Media[] {
  return movies.map(transformMovie);
}

/**
 * Transforma un array de series de TV
 */
export function transformTVShows(tvShows: TMDBTVShow[]): Media[] {
  return tvShows.map(transformTVShow);
}

/**
 * Transforma resultados de búsqueda multi
 */
export function transformMultiSearchResults(results: TMDBMultiSearchResult[]): Media[] {
  return results
    .map(transformMultiSearchResult)
    .filter((item): item is Media => item !== null);
}

/**
 * Transforma respuesta de lista con paginación
 */
export function transformListResponse<T extends Media>(
  results: T[],
  page: number,
  totalResults: number,
  totalPages: number
) {
  return {
    data: results,
    meta: {
      page,
      total_results: totalResults,
      total_pages: totalPages,
    },
  };
}

/**
 * Transforma respuesta de detalle
 */
export function transformDetailResponse(data: MediaDetails) {
  return {
    data,
  };
}

// ============================================
// Utilidades de validación
// ============================================

/**
 * Valida un objeto Media
 */
export function validateMedia(media: Media): boolean {
  if (!media.id || media.id <= 0) return false;
  if (!media.title || media.title.trim() === '') return false;
  if (!['movie', 'tv'].includes(media.media_type)) return false;
  return true;
}

/**
 * Filtra media inválida
 */
export function filterValidMedia(items: Media[]): Media[] {
  return items.filter(validateMedia);
}

/**
 * Ordena media por popularidad
 */
export function sortByPopularity(items: Media[]): Media[] {
  return [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
}

/**
 * Ordena media por rating
 */
export function sortByRating(items: Media[]): Media[] {
  return [...items].sort((a, b) => b.vote_average - a.vote_average);
}

/**
 * Ordena media por fecha (más recientes primero)
 */
export function sortByNewest(items: Media[]): Media[] {
  return [...items].sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
    const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Ordena media por año
 */
export function sortByYear(items: Media[], descending: boolean = true): Media[] {
  return [...items].sort((a, b) => {
    return descending ? b.year - a.year : a.year - b.year;
  });
}

/**
 * Filtra por género
 */
export function filterByGenre(items: Media[], genreId: number): Media[] {
  return items.filter(item => item.genre_ids.includes(genreId));
}

/**
 * Filtra por año mínimo
 */
export function filterByMinYear(items: Media[], minYear: number): Media[] {
  return items.filter(item => item.year >= minYear);
}

/**
 * Filtra por rating mínimo
 */
export function filterByMinRating(items: Media[], minRating: number): Media[] {
  return items.filter(item => item.vote_average >= minRating);
}

/**
 * Filtra por tipo de media
 */
export function filterByMediaType(items: Media[], mediaType: 'movie' | 'tv'): Media[] {
  return items.filter(item => item.media_type === mediaType);
}
