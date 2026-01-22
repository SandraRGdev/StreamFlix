// ============================================
// TMDB API - Person Hook
// ============================================

import { tmdbClient, TMDB_ENDPOINTS, buildDetailParams, CACHE_TIMES, type ApiError } from '../tmdb';
import { useTMDB } from './useTMDB';

export interface PersonDetails {
  id: number;
  name: string;
  original_name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string;
  known_for_department: string;
  also_known_as: string[];
  gender: number;
  popularity: number;
  imdb_id: string | null;
  homepage: string | null;
}

export interface PersonCredits {
  cast: Array<{
    id: number;
    title: string;
    original_title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    media_type: 'movie' | 'tv';
    character: string;
  }>;
  crew: Array<{
    id: number;
    title: string;
    original_title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    media_type: 'movie' | 'tv';
    job: string;
    department: string;
  }>;
}

export interface UsePersonOptions {
  id: number;
  enabled?: boolean;
}

export interface UsePersonResult {
  data: PersonDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePersonCreditsResult {
  data: PersonCredits | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Transforma los detalles de persona de TMDB
 */
function transformPersonDetails(data: any): PersonDetails {
  return {
    id: data.id,
    name: data.name,
    original_name: data.original_name || data.name,
    biography: data.biography || '',
    birthday: data.birthday || null,
    deathday: data.deathday || null,
    place_of_birth: data.place_of_birth || null,
    profile_path: data.profile_path
      ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
      : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E',
    known_for_department: data.known_for_department || '',
    also_known_as: data.also_known_as || [],
    gender: data.gender || 0,
    popularity: data.popularity || 0,
    imdb_id: data.imdb_id || null,
    homepage: data.homepage || null,
  };
}

/**
 * Transforma los créditos de persona
 */
function transformPersonCredits(data: any): PersonCredits {
  const transformCredit = (item: any, mediaType: 'movie' | 'tv') => ({
    id: item.id,
    title: mediaType === 'movie' ? item.title : item.name,
    original_title: mediaType === 'movie' ? item.original_title : item.original_name,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
      : null,
    release_date: mediaType === 'movie' ? (item.release_date || '') : (item.first_air_date || ''),
    vote_average: item.vote_average || 0,
    media_type: mediaType,
    character: item.character || '',
    job: item.job || '',
    department: item.department || '',
  });

  return {
    cast: [
      ...(data.cast?.map((item: any) => transformCredit(item, 'movie')) || []),
      ...(data.tv_cast?.map((item: any) => transformCredit(item, 'tv')) || []),
    ].sort((a, b) => {
      // Ordenar por fecha de lanzamiento (más recientes primero)
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA;
    }),
    crew: [
      ...(data.crew?.map((item: any) => transformCredit(item, 'movie')) || []),
      ...(data.tv_crew?.map((item: any) => transformCredit(item, 'tv')) || []),
    ].sort((a, b) => {
      // Ordenar por fecha de lanzamiento (más recientes primero)
      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA;
    }),
  };
}

/**
 * Hook para obtener detalles de una persona
 */
export function usePerson({ id, enabled = true }: UsePersonOptions): UsePersonResult {
  const fetcher = async () => {
    const params = buildDetailParams();
    const data = await tmdbClient.get<any>(TMDB_ENDPOINTS.personDetails(id), params, {
      cache: true,
      cacheTTL: CACHE_TIMES.details,
    });
    return transformPersonDetails(data);
  };

  return useTMDB(fetcher, { enabled: enabled && id > 0 });
}

/**
 * Hook para obtener los créditos de una persona
 */
export function usePersonCredits({ id, enabled = true }: UsePersonOptions): UsePersonCreditsResult {
  const fetcher = async () => {
    const data = await tmdbClient.get<any>(
      TMDB_ENDPOINTS.personCombinedCredits(id),
      {},
      {
        cache: true,
        cacheTTL: CACHE_TIMES.details,
      }
    );
    return transformPersonCredits(data);
  };

  return useTMDB(fetcher, { enabled: enabled && id > 0 });
}

/**
 * Hook para obtener detalles y créditos de una persona combinados
 */
export function usePersonDetails({ id, enabled = true }: UsePersonOptions) {
  const person = usePerson({ id, enabled });
  const credits = usePersonCredits({ id, enabled });

  return {
    person: person.data,
    credits: credits.data,
    loading: person.loading || credits.loading,
    error: person.error || credits.error,
    refetch: () => {
      person.refetch();
      credits.refetch();
    },
  };
}
