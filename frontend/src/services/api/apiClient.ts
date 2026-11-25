/**
 * Core HTTP Client with timeout, structured error handling, and offline fallback detection.
 * Defaults to port 8000 under /api prefix per docs/API_CONTRACT.md.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseUrl = config?.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    this.timeoutMs = config?.timeoutMs || (import.meta.env.MODE === 'test' ? 100 : 8000);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new ApiError(
          errorData?.message || errorData?.detail || `HTTP Error ${response.status}`,
          response.status,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out while contacting backend server', 408);
      }
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err?.message || 'Network error: Backend server is unreachable', 0);
    }
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const defaultApiClient = new ApiClient();
