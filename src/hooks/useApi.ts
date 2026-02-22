import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiResponse, ApiError } from '../types';

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  immediate = true,
  _dependencies: any[] = []
): UseApiReturn<ApiResponse<T>> {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);
  const apiFunctionRef = useRef(apiFunction);
  const hasExecutedRef = useRef(false);

  // Update ref when apiFunction changes
  useEffect(() => {
    apiFunctionRef.current = apiFunction;
  }, [apiFunction]);

  const execute = useCallback(
    async (...args: any[]): Promise<ApiResponse<T>> => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunctionRef.current(...args);
        setData(response);
        return response;
      } catch (err: any) {
        const errorMessage =
          (err as ApiError).message || err?.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Run once on mount if immediate is true
  useEffect(() => {
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}


