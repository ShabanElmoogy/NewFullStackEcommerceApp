import { SUBCATEGORY_URLS } from '@/constants';

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

export async function listSubCategories(): Promise<SubCategory[]> {
  const res = await fetch(SUBCATEGORY_URLS.GET_ALL);

  if (!res.ok) {
    throw new Error(`Failed to fetch subcategories: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getSubCategory(id: string | number): Promise<SubCategory> {
  const res = await fetch(SUBCATEGORY_URLS.GET_BY_ID(id));

  if (!res.ok) {
    throw new Error(`Failed to fetch subcategory: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getSubCategoriesByCategory(categoryId: string | number): Promise<SubCategory[]> {
  const res = await fetch(SUBCATEGORY_URLS.GET_BY_CATEGORY(categoryId));

  if (!res.ok) {
    throw new Error(`Failed to fetch subcategories for category: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function createSubCategory(subcategory: SubCategoryRequest): Promise<SubCategory> {
  const res = await fetch(SUBCATEGORY_URLS.CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subcategory),
  });

  if (!res.ok) {
    throw new Error(`Failed to create subcategory: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function updateSubCategory(subcategory: SubCategoryRequest): Promise<SubCategory> {
  const res = await fetch(SUBCATEGORY_URLS.UPDATE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subcategory),
  });

  if (!res.ok) {
    throw new Error(`Failed to update subcategory: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function deleteSubCategory(id: string | number): Promise<void> {
  const res = await fetch(SUBCATEGORY_URLS.DELETE(id), {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete subcategory: ${res.status} ${res.statusText}`);
  }
}