import { apiService } from './apiService';
import { PRODUCT_URLS } from '@/constants';

// Types for products
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  images?: string[];
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  stock: number;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  stock: number;
  specifications?: Record<string, any>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

// Product API functions
export async function listProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${PRODUCT_URLS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return await apiService.get<ProductsResponse>(url);
}

export async function getProduct(id: string | number): Promise<Product> {
  return await apiService.get<Product>(PRODUCT_URLS.GET_BY_ID(id));
}

export async function createProduct(productData: CreateProductRequest): Promise<Product> {
  return await apiService.post<Product>(PRODUCT_URLS.CREATE, productData, { requiresAuth: true });
}

export async function updateProduct(productData: UpdateProductRequest): Promise<Product> {
  return await apiService.put<Product>(PRODUCT_URLS.UPDATE(productData.id), productData, { requiresAuth: true });
}

export async function deleteProduct(id: string | number): Promise<void> {
  await apiService.delete(PRODUCT_URLS.DELETE(id), { requiresAuth: true });
}

export async function searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ProductsResponse> {
  const searchFilters = { ...filters, search: query };
  return await listProducts(searchFilters);
}

export async function getProductsByCategory(categoryId: string | number, filters?: Omit<ProductFilters, 'categoryId'>): Promise<ProductsResponse> {
  const categoryFilters = { ...filters, categoryId: categoryId.toString() };
  return await listProducts(categoryFilters);
}

export async function uploadProductImage(productId: string | number, imageFile: FormData): Promise<{ imageUrl: string }> {
  return await apiService.uploadFile<{ imageUrl: string }>(`/Products/UploadImage/${productId}`, imageFile, { requiresAuth: true });
}
