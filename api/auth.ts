import { apiService } from './apiService';
import { AUTH_URLS } from '@/constants';

// Types for authentication
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication API functions
export async function login(userName: string, password: string): Promise<AuthResponse> {
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.LOGIN, {
    userName,
    password
  });


  // Set both tokens for future requests
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.REGISTER, userData);


  // Set both tokens for future requests
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function refreshToken(refreshTokenData: RefreshTokenRequest): Promise<AuthResponse> {
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.REFRESH_TOKEN, refreshTokenData);


  // Update both tokens
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function logout(): Promise<void> {
  
  try {
    await apiService.post(AUTH_URLS.LOGOUT);
  } catch (error) {
  } finally {
    // Clear the auth token regardless of the response
    apiService.clearAuthToken();
  }
}

export async function forgotPassword(email: string): Promise<void> {
  await apiService.post(AUTH_URLS.FORGOT_PASSWORD, { email });
}

export async function resetPassword(resetData: ResetPasswordRequest): Promise<void> {
  await apiService.post(AUTH_URLS.RESET_PASSWORD, resetData);
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return apiService.getAuthToken() !== null;
}

// Helper function to get current auth token
export function getAuthToken(): string | null {
  return apiService.getAuthToken();
}

// Helper function to get current refresh token
export function getRefreshToken(): string | null {
  return apiService.getRefreshToken();
}
