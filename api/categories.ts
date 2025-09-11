import { CATEGORY_URLS } from '@/constants';

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
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
}

export async function listCategories(): Promise<Category[]> {
  const res = await fetch(CATEGORY_URLS.GET_ALL);

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getCategory(id: string | number): Promise<Category> {
  const res = await fetch(CATEGORY_URLS.GET_BY_ID(id));

  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function createCategory(category: CategoryRequest): Promise<Category> {
  const res = await fetch(CATEGORY_URLS.CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });

  if (!res.ok) {
    throw new Error(`Failed to create category: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function updateCategory(id: string | number, category: CategoryRequest): Promise<Category> {
  const res = await fetch(CATEGORY_URLS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...category, id }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update category: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function deleteCategory(id: string | number): Promise<void> {
  const res = await fetch(CATEGORY_URLS.DELETE(id), {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete category: ${res.status} ${res.statusText}`);
  }
}