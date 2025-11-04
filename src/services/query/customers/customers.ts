import { getCustomerByEmail, getCustomerById } from '@/services/api/customers/customers'
import { useQuery } from '@tanstack/react-query'

export function useGetCustomerById(customerId: number) {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => getCustomerById(customerId),
    staleTime: 1000 * 60 * 5,
    enabled: !!customerId
  })
}

export function useGetCustomerByEmail(email: string) {
  return useQuery({
    queryKey: ['customers', email],
    queryFn: () => getCustomerByEmail(email),
    staleTime: 1000 * 60 * 5,
    enabled: !!email
  })
}
