import { env } from '@/config/env';
import { ApiResponse } from '@/types';
import { getErrorMessage } from '@/utils';

// API Configuration
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

const defaultConfig: ApiConfig = {
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Request/Response types
interface RequestConfig extends RequestInit {
  timeout?: number;
  baseURL?: string;
}

interface ApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

// Custom API Error class
export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Request interceptors
type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor<T = unknown> = (response: T) => T | Promise<T>;
type ErrorInterceptor = (error: ApiClientError) => Promise<never>;

class ApiService implements ApiClient {
  private config: ApiConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Interceptor management
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor<T>(interceptor: ResponseInterceptor<T>): void {
    this.responseInterceptors.push(interceptor as ResponseInterceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // Private methods
  private async applyRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  private async applyResponseInterceptors<T>(response: T): Promise<T> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = (await interceptor(finalResponse)) as T;
    }
    return finalResponse;
  }

  private async applyErrorInterceptors(error: ApiClientError): Promise<never> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
    throw error;
  }

  private buildUrl(url: string, baseURL?: string): string {
    const base = baseURL || this.config.baseURL;
    if (url.startsWith('http')) return url;
    return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  }

  private async makeRequest<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    try {
      // Apply request interceptors
      const finalConfig = await this.applyRequestInterceptors({
        ...config,
        headers: {
          ...this.config.headers,
          ...config.headers,
        },
      });

      const fullUrl = this.buildUrl(url, finalConfig.baseURL);
      const timeout = finalConfig.timeout || this.config.timeout;

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(fullUrl, {
        ...finalConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError = new ApiClientError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code || 'HTTP_ERROR',
          errorData.details
        );
        return this.applyErrorInterceptors(apiError);
      }

      // Parse response
      const data = await response.json();

      // Apply response interceptors
      return this.applyResponseInterceptors(data);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network errors, timeouts, etc.
      const apiError = new ApiClientError(
        getErrorMessage(error),
        0,
        'NETWORK_ERROR'
      );
      return this.applyErrorInterceptors(apiError);
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>(url, { ...config, method: 'DELETE' });
  }
}

// Create default API client instance
export const apiClient = new ApiService();

// Add default interceptors
apiClient.addRequestInterceptor(config => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

apiClient.addResponseInterceptor(response => {
  // Handle API response wrapper
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse).data;
  }
  return response;
});

apiClient.addErrorInterceptor(async error => {
  // Handle 401 errors (unauthorized)
  if (error.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    // Redirect to login page
    window.location.href = '/login';
  }

  // Log errors in development
  if (env.ENABLE_DEBUG) {
    console.error('API Error:', error);
  }

  throw error;
});

// Export types
export type { ApiConfig, RequestConfig, ApiClient };
export { ApiService };
