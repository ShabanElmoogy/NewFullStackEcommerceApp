import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { BASE_URLS } from '@/constants';


// Request configuration interface
export interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private languageGetter: (() => string) | null = null;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URLS.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add Culture header based on current app language
        try {
          const currentLanguage = this.languageGetter ? this.languageGetter() : 'en';
          config.headers.Culture = currentLanguage || 'en'; // Default to 'en' if no language is set
        } catch (error) {
          // Fallback to 'en' if there's any issue accessing the language store
          config.headers.Culture = 'en';
        }

        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Check if error is 401 and we have a refresh token
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.axiosInstance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshResult = await this.refreshAuthToken();
            
            if (refreshResult) {
              this.processQueue(null, refreshResult.token);
              
              
              // Retry the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
              }
              
              const retryResponse = await this.axiosInstance(originalRequest);
              return retryResponse;
            } else {
              // Refresh failed, process queue with error
              this.processQueue(error, null);
              this.handleError(error);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleError(error);
            return Promise.reject(error);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        this.clearAuthToken();
        // You can emit an event or call a navigation function here
        break;
      case 403:
        // Forbidden
        break;
      case 404:
        // Not found
        break;
      case 500:
        // Server error
        break;
      default:
        break;
    }
  }

  
  // Authentication methods
  setAuthToken(token: string) {
    this.authToken = token;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  setTokens(token: string, refreshToken: string) {
    this.authToken = token;
    this.refreshToken = refreshToken;
  }

  clearAuthToken() {
    this.authToken = null;
    this.refreshToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  // Refresh token method
  async refreshAuthToken(): Promise<{ token: string; refreshToken: string } | null> {
    
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(`${BASE_URLS.API_URL}/Auth/RefreshToken`, {
        token: this.authToken,
        refreshToken: this.refreshToken,
      });

      const { token, refreshToken } = response.data;
      
      if (token && refreshToken) {
        this.setTokens(token, refreshToken);
        
        // Update the auth store with new tokens
        try {
          const { useAuth } = await import('@/store/authStore');
          useAuth.getState().setTokens(token, refreshToken);
        } catch (error) {
          console.warn('Failed to update auth store with new tokens:', error);
        }
        
        return { token, refreshToken };
      } else {
        return null;
      }
      
    } catch (error: any) {
      // If refresh fails, clear tokens
      this.clearAuthToken();
      
      // Clear tokens from auth store as well
      try {
        const { useAuth } = await import('@/store/authStore');
        useAuth.getState().logout();
      } catch (error) {
        console.warn('Failed to clear auth store:', error);
      }
      
      return null;
    }
  }

  // Process failed queue after token refresh
  private processQueue(error: any, token: string | null = null) {
    
    this.failedQueue.forEach(({ resolve, reject }, index) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Culture/Language methods
  setLanguageGetter(getter: () => string) {
    this.languageGetter = getter;
  }

  getCurrentCulture(): string {
    try {
      return this.languageGetter ? this.languageGetter() : 'en';
    } catch (error) {
      return 'en';
    }
  }

  setCultureHeader(culture: string) {
    // Update the default headers for all future requests
    this.axiosInstance.defaults.headers.common['Culture'] = culture;
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T = any>(url: string, file: FormData, config?: RequestConfig): Promise<T> {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await this.axiosInstance.post<T>(url, file, uploadConfig);
    return response.data;
  }

  // Download file method
  async downloadFile(url: string, config?: RequestConfig): Promise<Blob> {
    const downloadConfig = {
      ...config,
      responseType: 'blob' as const,
    };

    const response = await this.axiosInstance.get(url, downloadConfig);
    return response.data;
  }

  // Cancel request method
  createCancelToken() {
    return axios.CancelToken.source();
  }

  // Check if error is a cancel error
  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }

  }

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or multiple instances if needed
export default ApiService;
