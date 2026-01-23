// ============================================
// TMDB API - HTTP Client con Retry y Rate Limiting
// ============================================

import { TMDB_CONFIG, validateConfig } from './config';
import type { ApiError } from './types';
import { tmdbCache } from './cache';

/**
 * Delay con promise
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Error personalizado de API
 */
export class TMDBApiError extends Error implements ApiError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'TMDBApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Cola de peticiones para rate limiting
 */
class RequestQueue {
  private lastRequestTime: number = 0;
  private pending: number = 0;

  async acquire(): Promise<void> {
    while (this.pending >= 3) {
      // Máximo 3 peticiones simultáneas
      await delay(50);
    }

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < TMDB_CONFIG.requestDelay) {
      await delay(TMDB_CONFIG.requestDelay - timeSinceLastRequest);
    }

    this.pending++;
    this.lastRequestTime = Date.now();
  }

  release(): void {
    this.pending--;
  }
}

const requestQueue = new RequestQueue();

/**
 * Cliente HTTP para TMDB API
 */
export class TMDBClient {
  private apiKey: string;
  private baseUrl: string;
  private maxRetries: number;

  constructor() {
    validateConfig();
    this.apiKey = TMDB_CONFIG.apiKey;
    this.baseUrl = TMDB_CONFIG.baseUrl;
    this.maxRetries = TMDB_CONFIG.maxRetries;
  }

  /**
   * Realiza una petición HTTP con retry y rate limiting
   */
  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 0
  ): Promise<T> {
    await requestQueue.acquire();

    try {
      // TMDB API v3 usa api_key como query parameter
      const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
      url.searchParams.set('api_key', this.apiKey);

      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url.toString(), {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new TMDBApiError(
          errorData.status_message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.status_code
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // Reintentar en errores de red o rate limit
      if (
        retries < this.maxRetries &&
        (error instanceof TypeError ||
          (error instanceof TMDBApiError && ((error.status && (error.status === 429 || error.status >= 500)) || false)))
      ) {
        const retryDelay = TMDB_CONFIG.retryDelay * Math.pow(2, retries);
        await delay(retryDelay);
        return this.fetchWithRetry<T>(endpoint, options, retries + 1);
      }

      throw error;
    } finally {
      requestQueue.release();
    }
  }

  /**
   * Petición GET con soporte de caché
   */
  async get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options: {
      cache?: boolean;
      cacheTTL?: number;
    } = {}
  ): Promise<T> {
    const { cache = true, cacheTTL } = options;

    // Intentar obtener de caché
    if (cache) {
      const cached = tmdbCache.get<T>(endpoint, params);
      if (cached) {
        return cached;
      }
    }

    // Construir URL con parámetros
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryString.append(key, String(v)));
        } else {
          queryString.append(key, String(value));
        }
      }
    });

    const endpointWithParams = queryString
      ? `${endpoint}?${queryString.toString()}`
      : endpoint;

    // Realizar petición
    const data = await this.fetchWithRetry<T>(endpointWithParams);

    // Guardar en caché
    if (cache) {
      tmdbCache.set(endpoint, data, params, cacheTTL);
    }

    return data;
  }

  /**
   * Petición POST
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.fetchWithRetry<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Limpia la caché
   */
  clearCache(): void {
    tmdbCache.clear();
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getCacheStats() {
    return tmdbCache.getStats();
  }
}

// Exporta una instancia singleton del cliente
export const tmdbClient = new TMDBClient();
