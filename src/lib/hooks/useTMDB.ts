// ============================================
// TMDB API - Base Custom Hook
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiError } from '../tmdb';

export interface UseTMDBResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseTMDBOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook personalizado base para peticiones a TMDB
 * Maneja estado de carga, errores y refetch
 */
export function useTMDB<T>(
  fetcher: () => Promise<T>,
  options: UseTMDBOptions = {}
): UseTMDBResult<T> {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  // Usamos ref para evitar dependencias infinitas
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [fetcher, onSuccess, onError]);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      setData(result);
      onSuccessRef.current?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onErrorRef.current?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook para peticiones con parámetros
 */
export function useTMDBParams<T, P extends Record<string, any>>(
  fetcher: (params: P) => Promise<T>,
  params: P,
  options: UseTMDBOptions = {}
): UseTMDBResult<T> {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const paramsRef = useRef(params);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current(paramsRef.current);
      setData(result);
      onSuccessRef.current?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onErrorRef.current?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook para infinite scroll / paginación
 */
export function useTMDBInfinite<T>(
  fetcher: (page: number) => Promise<{ data: T[]; meta: { total_pages: number } }>,
  options: UseTMDBOptions = {}
) {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [fetcher, onSuccess, onError]);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current(page);
      setData(prev => [...prev, ...result.data]);
      setTotalPages(result.meta.total_pages);
      setHasMore(page < result.meta.total_pages);
      setPage(prev => prev + 1);
      onSuccessRef.current?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      onErrorRef.current?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, enabled, page]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setTotalPages(0);
    setError(null);
  }, []);

  useEffect(() => {
    if (enabled && data.length === 0) {
      fetchNextPage();
    }
  }, [enabled]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    totalPages,
    fetchNextPage,
    reset,
    refetch: () => {
      reset();
      fetchNextPage();
    },
  };
}
