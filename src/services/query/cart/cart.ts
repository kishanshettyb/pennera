import { getAllCart } from '@/services/api/cart-store/cart'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => getAllCart(),
    staleTime: 1000 * 60 * 5
  })
}
