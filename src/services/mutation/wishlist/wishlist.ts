'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { addToWishlist, removeFromWishlist } from '@/services/api/wishlist/wishlist'
import { AddWishlistData, RemoveWishlistData } from '@/types/wishlistTypes'

export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddWishlistData) => addToWishlist(data),

    onError: (error: unknown) => {
      let message = 'Unable to add item to wishlist.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Add to Wishlist Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Item added to wishlist!', {
        description: 'The item was successfully added to your wishlist.'
      })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },

    onSettled: async (_, error) => {
      if (!error) await queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RemoveWishlistData) => removeFromWishlist(data),

    onError: (error: unknown) => {
      let message = 'Unable to remove item from wishlist.'
      if (error instanceof AxiosError) {
        message = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error('Remove from Wishlist Failed', { description: message })
    },

    onSuccess: () => {
      toast.success('Item removed from wishlist!', {
        description: 'The item was successfully removed from your wishlist.'
      })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },

    onSettled: async (_, error) => {
      if (!error) await queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })
}
