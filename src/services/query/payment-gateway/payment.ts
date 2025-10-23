import { getAllPaymentGateways } from '@/services/api/payment-gateway/payment'
import { useQuery } from '@tanstack/react-query'

export function useGetAllPaymentGateways() {
  return useQuery({
    queryKey: ['payment_gateways'],
    queryFn: () => getAllPaymentGateways(),
    staleTime: 1000 * 60 * 5
  })
}
