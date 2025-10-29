import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getAllProducts,
  getAllProductsPagination,
  type GetAllProductsParams
} from '@/services/api/product/product'

export type Product = {
  id: number
  name: string
  price: string
  images?: { src: string }[]
  [key: string]: unknown
}

/**
 * ✅ Get all products (non-paginated)
 */
export function useGetAllProducts(params?: GetAllProductsParams) {
  return useQuery<Product[], Error>({
    queryKey: ['products', params],
    queryFn: () => getAllProducts(params ?? {})
  })
}

/**
 * ✅ Get all products with infinite pagination (type-safe)
 */
export function useGetAllProductsPagination(params?: GetAllProductsParams) {
  return useInfiniteQuery<
    Product[],
    Error,
    Product[],
    [string, GetAllProductsParams | undefined],
    number
  >({
    queryKey: ['products', params],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      getAllProductsPagination({ ...params, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined
    }
  })
}

/**
 * ✅ Search products (cached for 5 minutes)
 */
export function useGetAllSearchProducts(params?: GetAllProductsParams, enabled: boolean = true) {
  return useQuery<Product[], Error>({
    queryKey: ['searchproducts', params],
    queryFn: () => getAllProducts(params ?? {}),
    staleTime: 1000 * 60 * 5,
    enabled: enabled && !!params?.search
  })
}
