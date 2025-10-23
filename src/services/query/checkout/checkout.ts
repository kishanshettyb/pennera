import { getCheckoutData } from '@/services/api/checkout/checkout'
import { useQuery } from '@tanstack/react-query'

export function useGetCheckoutData() {
  return useQuery({
    queryKey: ['checkout'],
    queryFn: () => getCheckoutData(),
    staleTime: 1000 * 60 * 5
  })
}
