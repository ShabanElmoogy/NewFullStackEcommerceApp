import { apiService } from './apiService';
import { USER_URLS } from '@/constants';

// Types for user/profile
export interface User {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
  password: string;
}

// User/Profile API functions
export async function getProfile(): Promise<User> {
  return await apiService.get<User>(USER_URLS.PROFILE, { requiresAuth: true });
}

export async function updateProfile(profileData: UpdateProfileRequest): Promise<User> {
  return await apiService.put<User>(USER_URLS.UPDATE_PROFILE, profileData, { requiresAuth: true });
}

export async function changePassword(passwordData: ChangePasswordRequest): Promise<void> {
  await apiService.post(USER_URLS.CHANGE_PASSWORD, passwordData, { requiresAuth: true });
}

export async function updateEmail(emailData: UpdateEmailRequest): Promise<void> {
  await apiService.put('/User/UpdateEmail', emailData, { requiresAuth: true });
}

export async function uploadProfileImage(imageFile: FormData): Promise<{ imageUrl: string }> {
  return await apiService.uploadFile<{ imageUrl: string }>('/User/UploadProfileImage', imageFile, { requiresAuth: true });
}

export async function deleteAccount(password: string): Promise<void> {
  await apiService.delete(USER_URLS.DELETE_ACCOUNT, { 
    requiresAuth: true,
    data: { password }
  });
}

export async function verifyEmail(token: string): Promise<void> {
  await apiService.post('/User/VerifyEmail', { token });
}

export async function resendEmailVerification(): Promise<void> {
  await apiService.post('/User/ResendEmailVerification', {}, { requiresAuth: true });
}

export async function verifyPhoneNumber(phoneNumber: string, verificationCode: string): Promise<void> {
  await apiService.post('/User/VerifyPhoneNumber', { 
    phoneNumber, 
    verificationCode 
  }, { requiresAuth: true });
}

export async function sendPhoneVerification(phoneNumber: string): Promise<void> {
  await apiService.post('/User/SendPhoneVerification', { phoneNumber }, { requiresAuth: true });
}

// Helper functions
export async function getFullName(): Promise<string> {
  try {
    const profile = await getProfile();
    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';
    return `${firstName} ${lastName}`.trim() || profile.userName;
  } catch (error) {
    console.error('Error getting full name:', error);
    return '';
  }
}

export async function isProfileComplete(): Promise<boolean> {
  try {
    const profile = await getProfile();
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.email &&
      profile.phoneNumber
    );
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
}
