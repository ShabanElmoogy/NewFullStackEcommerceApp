import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listProducts, getProduct } from '@/api/products';

// Query Keys - centralized for consistency
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

// Custom hook for fetching all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: listProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for fetching a single product
export function useProduct(id: Number) {
  return useQuery({
    queryKey: productKeys.detail(Number(id)),
    queryFn: () => getProduct(Number(id)),
    enabled: !!id && !isNaN(Number(id)), // Only run when id is valid
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Custom hook for prefetching a product (useful for hover/navigation)
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (id: Number) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Custom hook for invalidating product queries (useful after mutations)
export function useInvalidateProducts() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
    invalidateList: () => queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
    invalidateProduct: (id) =>
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }),
  };
}