import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getAllProducts,
  getAllProductsPagination,
  GetAllProductsParams
} from '@/services/api/product/product'

export function useGetAllProducts(params?: GetAllProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getAllProducts(params ?? {})
  })
}
export function useGetAllProductsPagination(params?: GetAllProductsParams) {
  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: ({ pageParam = 1 }) => getAllProductsPagination({ ...params, pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // If last page has exactly 10 items, load next page
      return lastPage.length === 20 ? allPages.length + 1 : undefined
    }
  })
}

export function useGetAllSearchProducts(params?: GetAllProductsParams, enabled = true) {
  return useQuery({
    queryKey: ['searchproducts', params],
    queryFn: () => getAllProducts(params ?? {}),
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    enabled: enabled && !!params?.search
    // keepPreviousData: true // useful for pagination
  })
}
