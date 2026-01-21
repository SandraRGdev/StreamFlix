// ============================================
// TMDB API - In-Memory Cache System
// ============================================

import type { CacheEntry } from './types';
import { TMDB_CONFIG } from './config';

/**
 * Sistema de caché en memoria para respuestas de API
 */
class TMDBCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private enabled: boolean = TMDB_CONFIG.enableCache;

  /**
   * Genera una key de caché basada en endpoint y parámetros
   */
  private generateKey(endpoint: string, params: Record<string, any> = {}): string {
    const paramsStr = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${endpoint}?${paramsStr}`;
  }

  /**
   * Obtiene un valor de la caché si existe y no ha expirado
   */
  get<T>(endpoint: string, params: Record<string, any> = {}): T | null {
    if (!this.enabled) return null;

    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Guarda un valor en la caché
   */
  set<T>(
    endpoint: string,
    data: T,
    params: Record<string, any> = {},
    ttl: number = TMDB_CONFIG.cacheTTL
  ): void {
    if (!this.enabled) return;

    const key = this.generateKey(endpoint, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);

    // Limpiar entradas viejas periódicamente
    if (this.cache.size > 100) {
      this.clean();
    }
  }

  /**
   * Elimina una entrada específica de la caché
   */
  delete(endpoint: string, params: Record<string, any> = {}): void {
    const key = this.generateKey(endpoint, params);
    this.cache.delete(key);
  }

  /**
   * Limpia todas las entradas de la caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Elimina entradas expiradas
   */
  private clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getStats() {
    return {
      size: this.cache.size,
      enabled: this.enabled,
    };
  }

  /**
   * Habilita o deshabilita la caché
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Exporta una instancia singleton
export const tmdbCache = new TMDBCache();
