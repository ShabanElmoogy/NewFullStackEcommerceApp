import { apiService } from './apiService';
import { CATEGORY_URLS } from '@/constants';

// Keep existing interfaces but update them to use the new API service
export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  image?: string | null;
  subCategories: SubCategory[];
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
}

export interface SubCategory {
  id: number;
  nameAr: string;
  nameEn: string;
  isDeleted: boolean;
}

export interface CategoryRequest {
  id?: number;
  nameAr: string;
  nameEn: string;
  image?: string | null;
}

// Category API functions using the new API service
export async function listCategories(): Promise<Category[]> {
  return await apiService.get<Category[]>(CATEGORY_URLS.GET_ALL);
}

export async function getCategory(id: string | number): Promise<Category> {
  return await apiService.get<Category>(CATEGORY_URLS.GET_BY_ID(id));
}

export async function createCategory(category: CategoryRequest): Promise<Category> {
  return await apiService.post<Category>(CATEGORY_URLS.CREATE, category, { requiresAuth: true });
}

export async function updateCategory(id: string | number, category: CategoryRequest): Promise<Category> {
  const updateData = { ...category, id };
  return await apiService.put<Category>(CATEGORY_URLS.UPDATE, updateData, { requiresAuth: true });
}

export async function deleteCategory(id: string | number): Promise<void> {
  await apiService.delete(CATEGORY_URLS.DELETE(id), { requiresAuth: true });
}

// Helper functions
export async function getCategoriesWithSubcategories(): Promise<Category[]> {
  const categories = await listCategories();
  return categories.filter(cat => !cat.isDeleted);
}

export async function getActiveCategories(): Promise<Category[]> {
  const categories = await listCategories();
  return categories.filter(cat => !cat.isDeleted);
}
