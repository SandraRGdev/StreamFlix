/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string
  readonly VITE_TMDB_API_VERSION: string
  readonly VITE_TMDB_BASE_URL: string
  readonly VITE_TMDB_IMAGE_BASE_URL: string
  readonly VITE_TMDB_IMAGE_SIZE_POSTER: string
  readonly VITE_TMDB_IMAGE_SIZE_BACKDROP: string
  readonly VITE_TMDB_IMAGE_SIZE_STILL: string
  readonly VITE_TMDB_REQUEST_DELAY: string
  readonly VITE_TMDB_MAX_RETRIES: string
  readonly VITE_ENABLE_CACHE: string
  readonly VITE_CACHE_TTL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
