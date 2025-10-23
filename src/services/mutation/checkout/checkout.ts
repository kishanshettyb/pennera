import { checkoutCart, checkoutOrder } from '@/services/api/checkout/checkout'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCheckoutOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { orderId: number; data }) =>
      checkoutOrder(payload.orderId, payload.data),

    onError: () => {
      toast.error('Unable to complete checkout')
    },

    onSuccess: () => {
      toast.success('Order has been placed successfully')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}

export function useCheckoutCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => checkoutCart(payload),

    onError: () => {
      toast.error('Unable to process checkout')
    },

    onSuccess: () => {
      toast.success('Order placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}
