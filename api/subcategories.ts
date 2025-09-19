import { apiService } from './apiService';
import { SUBCATEGORY_URLS } from '@/constants';

// Keep existing interfaces but update them to use the new API service
export interface SubCategory {
  id: number;
  nameAr: string;
  nameEn: string;
  categories: CategoryInfo[];
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
}

export interface CategoryInfo {
  id: number;
  nameAr: string;
  nameEn: string;
  isDeleted: boolean;
}

export interface SubCategoryRequest {
  id?: number;
  nameAr: string;
  nameEn: string;
  categoryIds: number[];
}

// SubCategory API functions using the new API service
export async function listSubCategories(): Promise<SubCategory[]> {
  return await apiService.get<SubCategory[]>(SUBCATEGORY_URLS.GET_ALL);
}

export async function getSubCategory(id: string | number): Promise<SubCategory> {
  return await apiService.get<SubCategory>(SUBCATEGORY_URLS.GET_BY_ID(id));
}

export async function getSubCategoriesByCategory(categoryId: string | number): Promise<SubCategory[]> {
  return await apiService.get<SubCategory[]>(SUBCATEGORY_URLS.GET_BY_CATEGORY(categoryId));
}

export async function createSubCategory(subcategory: SubCategoryRequest): Promise<SubCategory> {
  return await apiService.post<SubCategory>(SUBCATEGORY_URLS.CREATE, subcategory, { requiresAuth: true });
}

export async function updateSubCategory(subcategory: SubCategoryRequest): Promise<SubCategory> {
  return await apiService.put<SubCategory>(SUBCATEGORY_URLS.UPDATE, subcategory, { requiresAuth: true });
}

export async function deleteSubCategory(id: string | number): Promise<void> {
  await apiService.delete(SUBCATEGORY_URLS.DELETE(id), { requiresAuth: true });
}

// Helper functions
export async function getActiveSubCategories(): Promise<SubCategory[]> {
  const subcategories = await listSubCategories();
  return subcategories.filter(subcat => !subcat.isDeleted);
}

export async function getActiveSubCategoriesByCategory(categoryId: string | number): Promise<SubCategory[]> {
  const subcategories = await getSubCategoriesByCategory(categoryId);
  return subcategories.filter(subcat => !subcat.isDeleted);
}
