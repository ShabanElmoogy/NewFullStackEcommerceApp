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
  console.log('🚀 [Auth] Starting login process for user:', userName);
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.LOGIN, {
    userName,
    password
  });

  console.log('✅ [Auth] Login successful, received tokens (FULL):');
  console.log('  - Token:', response.token || 'null');
  console.log('  - Refresh Token:', response.refreshToken || 'null');
  console.log('  - Expires At:', response.expiresAt);
  console.log('  - User ID:', response.id);
  console.log('  - Username:', response.userName);
  console.log('  - Email:', response.email);

  // Set both tokens for future requests
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  console.log('📝 [Auth] Starting registration process for user:', userData.userName);
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.REGISTER, userData);

  console.log('✅ [Auth] Registration successful, received tokens');
  console.log('  - Token:', response.token ? `${response.token.substring(0, 20)}...` : 'null');
  console.log('  - Refresh Token:', response.refreshToken ? `${response.refreshToken.substring(0, 20)}...` : 'null');

  // Set both tokens for future requests
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function refreshToken(refreshTokenData: RefreshTokenRequest): Promise<AuthResponse> {
  console.log('🔄 [Auth] Manual refresh token request initiated');
  console.log('  - Refresh Token:', refreshTokenData.refreshToken ? `${refreshTokenData.refreshToken.substring(0, 20)}...` : 'null');
  
  const response = await apiService.post<AuthResponse>(AUTH_URLS.REFRESH_TOKEN, refreshTokenData);

  console.log('✅ [Auth] Manual refresh successful, received new tokens');
  console.log('  - New Token:', response.token ? `${response.token.substring(0, 20)}...` : 'null');
  console.log('  - New Refresh Token:', response.refreshToken ? `${response.refreshToken.substring(0, 20)}...` : 'null');

  // Update both tokens
  if (response.token && response.refreshToken) {
    apiService.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function logout(): Promise<void> {
  console.log('👋 [Auth] Starting logout process...');
  
  try {
    await apiService.post(AUTH_URLS.LOGOUT);
    console.log('✅ [Auth] Logout API call successful');
  } catch (error) {
    console.log('⚠️ [Auth] Logout API call failed, but continuing with token cleanup');
  } finally {
    // Clear the auth token regardless of the response
    apiService.clearAuthToken();
    console.log('🧹 [Auth] Logout completed, tokens cleared');
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
