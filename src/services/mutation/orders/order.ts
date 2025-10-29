import { updateOrderByOrderId } from '@/services/api/orders/orders'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateOrderById() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { orderId: string; data: unknown }) =>
      updateOrderByOrderId(payload.orderId, payload.data),

    onError: () => {
      toast.error('Failed to update order')
    },

    onSuccess: (data) => {
      toast.success('Order updated successfully')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', data?.id] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
    }
  })
}
