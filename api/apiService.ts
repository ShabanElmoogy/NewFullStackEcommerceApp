import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { BASE_URLS } from '@/constants';
import { useLanguageStore } from '@/store/languageStore';

// RFC 9110 Problem Details error format (from your API)
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

// Simplified API Error interface
export interface ApiError extends Error {
  status?: number;
  title?: string;
  type?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  fieldErrors?: Record<string, string[]>;
}

// Request configuration interface
export interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

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
          const currentLanguage = useLanguageStore.getState().language;
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
      (error: AxiosError) => {
        // Handle common errors
        this.handleError(error);
        return Promise.reject(this.formatError(error));
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

  private formatError(error: AxiosError): ApiError {
    const response = error.response;
    
    if (response?.data) {
      const problemDetails = response.data as ProblemDetails;
      
      // Check if it's RFC 9110 Problem Details format
      if (problemDetails.type || problemDetails.title || problemDetails.status || problemDetails.errors) {
        return this.createApiError(problemDetails, response.status);
      }
    }

    // Fallback for non-Problem Details errors
    return this.createApiError({
      title: 'Request Failed',
      status: response?.status,
      errors: { general: [error.message || 'An unexpected error occurred'] }
    }, response?.status);
  }

  private createApiError(problemDetails: ProblemDetails, statusCode?: number): ApiError {
    // Get the main error message
    let message = 'An error occurred';
    
    if (problemDetails.errors) {
      // Get the first error message from the errors object
      const firstErrorMessages = Object.values(problemDetails.errors)[0];
      if (firstErrorMessages && firstErrorMessages.length > 0) {
        message = firstErrorMessages[0];
      }
    } else if (problemDetails.title) {
      message = problemDetails.title;
    } else if (problemDetails.detail) {
      message = problemDetails.detail;
    }

    // Create a proper Error object
    const apiError = new Error(message) as ApiError;
    apiError.name = 'ApiError';
    apiError.status = problemDetails.status || statusCode;
    apiError.title = problemDetails.title;
    apiError.type = problemDetails.type;
    apiError.detail = problemDetails.detail;
    apiError.errors = problemDetails.errors;
    apiError.fieldErrors = problemDetails.errors; // Alias for easier access

    
    return apiError;
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // Culture/Language methods
  getCurrentCulture(): string {
    try {
      return useLanguageStore.getState().language || 'en';
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

  // Simplified error utility methods
  static isApiError(error: any): error is ApiError {
    return error && error.name === 'ApiError';
  }

  static getErrorMessage(error: ApiError): string {
    return error.message;
  }

  static getFieldErrors(error: ApiError): Record<string, string[]> | null {
    return error.fieldErrors || null;
  }

  static getAllErrorMessages(error: ApiError): string[] {
    if (error.fieldErrors) {
      return Object.values(error.fieldErrors).flat();
    }
    return [error.message];
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or multiple instances if needed
export default ApiService;
