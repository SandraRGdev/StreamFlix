// ============================================
// TMDB API - TypeScript Types & Interfaces
// ============================================

// ============================================
// Raw TMDB Response Types
// ============================================

export interface TMDBBaseResponse {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface TMDBMovie {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBTVShow {
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  origin_country: string[];
  vote_average: number;
  vote_count: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: TMDBGenre[];
  homepage: string;
  imdb_id: string;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  video: boolean;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      character: string;
      name: string;
      order: number;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      department: string;
      job: string;
      name: string;
      profile_path: string | null;
    }>;
  };
  similar?: {
    results: TMDBMovie[];
  };
}

export interface TMDBTVDetails extends TMDBTVShow {
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  genres: TMDBGenre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  networks: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
      published_at: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      character: string;
      name: string;
      order: number;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      department: string;
      job: string;
      name: string;
      profile_path: string | null;
    }>;
  };
  similar?: {
    results: TMDBTVShow[];
  };
}

export interface TMDBMultiSearchResult {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  known_for?: TMDBMovie[] | TMDBTVShow[];
  profile_path?: string;
}

export interface TMDBSearchResponse<T> extends TMDBBaseResponse {
  results: T[];
}

// ============================================
// Normalized Application Types
// ============================================

export type MediaType = 'movie' | 'tv';

export interface Media {
  id: number;
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  year: number;
  vote_average: number;
  vote_count: number | null;
  popularity: number | null;
  genre_ids: number[];
  genres: TMDBGenre[] | null;
  original_language: string | null;
  adult: boolean;
  video: boolean;
  runtime?: number | null;
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  status?: string | null;
}

export interface MediaDetails extends Media {
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdb_id?: string;
  tagline?: string;
  production_companies?: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  spoken_languages?: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  seasons?: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }>;
  videos?: Array<{
    id: string;
    key: string;
    name: string;
    type: string;
    official: boolean;
    site: string;
    thumbnail: string;
  }>;
  cast?: Array<{
    id: number;
    character: string;
    name: string;
    profile_path: string | null;
  }>;
  crew?: Array<{
    id: number;
    department: string;
    job: string;
    name: string;
    profile_path: string | null;
  }>;
  similar?: Media[];
}

export interface MediaListResponse {
  data: Media[];
  meta: {
    page: number;
    total_results: number;
    total_pages: number;
  };
}

export interface MediaDetailResponse {
  data: MediaDetails;
}

export interface SearchFilters {
  media_type?: MediaType | 'all';
  year?: number;
  genre?: number;
  language?: string;
  vote_average_gte?: number;
  vote_average_lte?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
