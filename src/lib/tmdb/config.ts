// ============================================
// TMDB API - Configuration & Constants
// ============================================

/**
 * Configuración de la API TMDB
 */
export const TMDB_CONFIG = {
  // Credenciales
  apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
  apiVersion: import.meta.env.VITE_TMDB_API_VERSION || '3',

  // URLs base
  baseUrl: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  imageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',

  // Tamaños de imagen
  imageSizes: {
    poster: import.meta.env.VITE_TMDB_IMAGE_SIZE_POSTER || 'w500',
    backdrop: import.meta.env.VITE_TMDB_IMAGE_SIZE_BACKDROP || 'original',
    still: import.meta.env.VITE_TMDB_IMAGE_SIZE_STILL || 'w300',
    thumbnail: 'w154',
    profile: 'w185',
  },

  // Rate limiting
  requestDelay: parseInt(import.meta.env.VITE_TMDB_REQUEST_DELAY || '100'),
  maxRetries: parseInt(import.meta.env.VITE_TMDB_MAX_RETRIES || '3'),
  retryDelay: 1000, // ms

  // Cache
  enableCache: import.meta.env.VITE_ENABLE_CACHE !== 'false',
  cacheTTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'), // 5 minutos por defecto

  // Validación
  minYear: 1900,
  maxYear: new Date().getFullYear() + 5,

  // Imagen placeholder
  placeholderImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E',
} as const;

/**
 * Tiempos de cache por tipo de endpoint (ms)
 */
export const CACHE_TIMES = {
  trending: 180000,      // 3 minutos
  popular: 300000,       // 5 minutos
  search: 60000,         // 1 minuto
  details: 600000,       // 10 minutos
  genres: 86400000,      // 24 horas
  configuration: 86400000, // 24 horas
} as const;

/**
 * Parámetros de paginación por defecto
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

/**
 * Géneros por defecto para filtros
 */
export const DEFAULT_GENRES = {
  movie: [
    { id: 28, name: 'Acción' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animación' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 99, name: 'Documental' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Familia' },
    { id: 14, name: 'Fantasía' },
    { id: 36, name: 'Historia' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Música' },
    { id: 9648, name: 'Misterio' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ciencia Ficción' },
    { id: 10770, name: 'Película TV' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'Bélica' },
    { id: 37, name: 'Western' },
  ],
  tv: [
    { id: 10759, name: 'Acción y Aventura' },
    { id: 16, name: 'Animación' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 99, name: 'Documental' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Familia' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Misterio' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ],
} as const;

/**
 * Códigos de idioma soportados
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
] as const;

/**
 * Ventanas de tiempo para trending
 */
export const TIME_WINDOWS = {
  day: 'day',
  week: 'week',
} as const;

export type TimeWindow = typeof TIME_WINDOWS[keyof typeof TIME_WINDOWS];

/**
 * Ordenamiento para discover
 */
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidad descendente' },
  { value: 'popularity.asc', label: 'Popularidad ascendente' },
  { value: 'vote_average.desc', label: 'Mejor valoradas' },
  { value: 'vote_average.asc', label: 'Menor valoradas' },
  { value: 'release_date.desc', label: 'Más recientes' },
  { value: 'release_date.asc', label: 'Más antiguas' },
  { value: 'revenue.desc', label: 'Mayor recaudación' },
  { value: 'revenue.asc', label: 'Menor recaudación' },
] as const;

/**
 * Valida que la API key esté configurada
 */
export function validateConfig(): void {
  if (!TMDB_CONFIG.apiKey) {
    throw new Error(
      'TMDB API Key no configurada. ' +
      'Por favor configura VITE_TMDB_API_KEY en tu archivo .env'
    );
  }
}

/**
 * Construye la URL completa de imagen
 */
export function buildImageUrl(
  path: string | null,
  size: keyof typeof TMDB_CONFIG.imageSizes = 'poster'
): string {
  if (!path) {
    return TMDB_CONFIG.placeholderImage;
  }

  if (path.startsWith('http')) {
    return path;
  }

  const sizeValue = TMDB_CONFIG.imageSizes[size];
  return `${TMDB_CONFIG.imageBaseUrl}/${sizeValue}${path}`;
}

/**
 * Construye la URL del video de YouTube
 */
export function buildYouTubeUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${key}`;
}

/**
 * Construye la URL de thumbnail de YouTube
 */
export function buildYouTubeThumbnail(key: string): string {
  return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
}
