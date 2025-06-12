import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, ApiClientError } from '@/services/api';
import { LoadingState } from '@/types';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiClientError) => void;
}

interface UseApiReturn<T> extends LoadingState {
  data: T | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(
  apiCall: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await apiCall(...args);

        if (mountedRef.current) {
          setData(result);
          onSuccess?.(result);
        }

        return result;
      } catch (err) {
        const apiError = err as ApiClientError;

        if (mountedRef.current) {
          setError(apiError.message);
          onError?.(apiError);
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [apiCall, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}

// Specialized hooks for common HTTP methods
export function useGet<T = unknown>(
  url: string,
  options: UseApiOptions & { immediate?: boolean } = {}
): UseApiReturn<T> {
  const apiCall = useCallback(() => apiClient.get<T>(url), [url]);
  return useApi(apiCall, options);
}

export function usePost<T = unknown, D = unknown>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> & {
  post: (data: D) => Promise<T | null>;
} {
  const apiCall = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as D;
      return apiClient.post<T>(url, data);
    },
    [url]
  );
  const result = useApi(apiCall, options);

  return {
    ...result,
    post: result.execute as (data: D) => Promise<T | null>,
  };
}

export function usePut<T = unknown, D = unknown>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> & {
  put: (data: D) => Promise<T | null>;
} {
  const apiCall = useCallback(
    (...args: unknown[]) => {
      const data = args[0] as D;
      return apiClient.put<T>(url, data);
    },
    [url]
  );
  const result = useApi(apiCall, options);

  return {
    ...result,
    put: result.execute as (data: D) => Promise<T | null>,
  };
}

export function useDelete<T = unknown>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> & {
  deleteResource: () => Promise<T | null>;
} {
  const apiCall = useCallback(() => apiClient.delete<T>(url), [url]);
  const result = useApi(apiCall, options);

  return {
    ...result,
    deleteResource: result.execute as () => Promise<T | null>,
  };
}

// Hook for paginated data
interface UsePaginatedApiOptions extends UseApiOptions {
  initialPage?: number;
  pageSize?: number;
}

interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UsePaginatedApiReturn<T> extends LoadingState {
  data: T[];
  pagination: PaginatedData<T>['pagination'] | null;
  loadPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePaginatedApi<T = unknown>(
  baseUrl: string,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiReturn<T> {
  const { initialPage = 1, pageSize = 20, ...apiOptions } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedData<T>['pagination'] | null
  >(null);

  const apiCall = useCallback(
    (...args: unknown[]) => {
      const page = args[0] as number;
      const url = `${baseUrl}?page=${page}&limit=${pageSize}`;
      return apiClient.get<PaginatedData<T>>(url);
    },
    [baseUrl, pageSize]
  );

  const { isLoading, error, execute } = useApi(apiCall, {
    ...apiOptions,
    onSuccess: result => {
      const paginatedResult = result as PaginatedData<T>;
      setData(paginatedResult.data);
      setPagination(paginatedResult.pagination);
      apiOptions.onSuccess?.(result);
    },
  });

  const loadPage = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      await execute(page);
    },
    [execute]
  );

  const nextPage = useCallback(async () => {
    if (pagination?.hasNext) {
      await loadPage(currentPage + 1);
    }
  }, [pagination?.hasNext, loadPage, currentPage]);

  const prevPage = useCallback(async () => {
    if (pagination?.hasPrev) {
      await loadPage(currentPage - 1);
    }
  }, [pagination?.hasPrev, loadPage, currentPage]);

  const refresh = useCallback(async () => {
    await loadPage(currentPage);
  }, [loadPage, currentPage]);

  useEffect(() => {
    if (options.immediate !== false) {
      loadPage(initialPage);
    }
  }, [loadPage, initialPage, options.immediate]);

  return {
    data,
    pagination,
    isLoading,
    error,
    loadPage,
    nextPage,
    prevPage,
    refresh,
  };
}
