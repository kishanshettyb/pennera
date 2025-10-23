'use client'

import {
  addToCart,
  applyCouponCart,
  removeCouponCart,
  removeFromCart,
  updateCartItem
} from '@/services/api/cart-store/cart'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      id: number
      quantity: number
      variation?: { attribute: string; value: string }[]
    }) => addToCart(payload),

    onError: (error) => {
      let message = 'Unable to add item to cart.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Add to Cart Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Item added to cart!', { description: 'The item was successfully added.' })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (key: string) => removeFromCart(key),

    onError: (error) => {
      let message = 'Unable to remove item from cart.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Remove from Cart Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Item removed from cart!', {
        description: 'The item was successfully removed.'
      })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { key: string; quantity: number }) =>
      updateCartItem(payload.key, payload.quantity),

    onError: (error) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.message ?? error.message)
      } else if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Unable to update cart item.')
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}

export function useMergeCart() {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/cart/merge')
      return response.data
    },

    onSuccess: () => {
      toast.success('Cart merged successfully!', {
        description: 'Your items are now in your account cart.'
      })
    },

    onError: () => {
      toast.error('Cart merge failed', { description: 'Please try again.' })
    }
  })
}

export function useApplyCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { code: string }) => applyCouponCart(payload),

    onError: (error) => {
      let message = 'Unable to apply coupon.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Coupon Apply Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Coupon applied successfully!', {
        description: 'Your discount has been added to the cart.'
      })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { code: string }) => removeCouponCart(payload),

    onError: (error) => {
      let message = 'Unable to remove coupon.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Coupon Remove Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Coupon removed successfully!', {
        description: 'The discount has been cleared from your cart.'
      })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  })
}
