import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listSubCategories, 
  getSubCategory, 
  getSubCategoriesByCategory,
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory,
  SubCategory,
  SubCategoryRequest 
} from '@/api/subcategories';

// Query keys
export const subCategoryKeys = {
  all: ['subcategories'] as const,
  lists: () => [...subCategoryKeys.all, 'list'] as const,
  list: (filters: string) => [...subCategoryKeys.lists(), { filters }] as const,
  byCategory: (categoryId: string | number) => [...subCategoryKeys.all, 'byCategory', categoryId] as const,
  details: () => [...subCategoryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...subCategoryKeys.details(), id] as const,
};

// Hook to get all subcategories
export function useSubCategories() {
  return useQuery({
    queryKey: subCategoryKeys.lists(),
    queryFn: listSubCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get subcategories by category
export function useSubCategoriesByCategory(categoryId: string | number) {
  return useQuery({
    queryKey: subCategoryKeys.byCategory(categoryId),
    queryFn: () => getSubCategoriesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to get a single subcategory
export function useSubCategory(id: string | number) {
  return useQuery({
    queryKey: subCategoryKeys.detail(id),
    queryFn: () => getSubCategory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to create a subcategory
export function useCreateSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.all });
    },
  });
}

// Hook to update a subcategory
export function useUpdateSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.all });
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.detail(data.id) });
    },
  });
}

// Hook to delete a subcategory
export function useDeleteSubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subCategoryKeys.all });
    },
  });
}