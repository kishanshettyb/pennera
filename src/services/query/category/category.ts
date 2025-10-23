import { getAllCategory } from '@/services/api/category/category'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCategory() {
  return useQuery({
    queryKey: ['category'],
    queryFn: () => getAllCategory(),
    staleTime: 1000 * 60 * 5 // cache for 5 mins
  })
}
