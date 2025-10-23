import { getAllOrders, getOrderByOrderId } from '@/services/api/orders/orders'
import { useQuery } from '@tanstack/react-query'

export function useGetAllOrders(customerId: string) {
  return useQuery({
    queryKey: ['orders', customerId],
    queryFn: () => getAllOrders(customerId),
    staleTime: 1000 * 60 * 5 // cache for 5 mins
  })
}

export function useGetOrderByOrderId(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderByOrderId(orderId),
    staleTime: 1000 * 60 * 5,
    enabled: !!orderId
  })
}
