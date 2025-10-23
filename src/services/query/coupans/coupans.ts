import { getAllCoupans } from '@/services/api/coupans/coupans'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCoupans() {
  return useQuery({
    queryKey: ['coupans'],
    queryFn: () => getAllCoupans(),
    staleTime: 1000 * 60 * 5
  })
}
