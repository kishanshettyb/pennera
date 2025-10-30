import { AddWishlistData, RemoveWishlistData, WishlistItem } from '@/types/wishlistTypes'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WISHLIST_URL
})

// 🔹 Get all wishlist items
export const getAllWishlist = async (user_id: number) => {
  const response = await axiosInstance.get('list', {
    params: { user_id }
  })
  return response.data
}

// 🔹 Add to wishlist
export const addToWishlist = async (data: AddWishlistData): Promise<WishlistItem> => {
  const response = await axiosInstance.post('add', data)
  return response.data
}

// 🔹 Remove from wishlist
export const removeFromWishlist = async (
  data: RemoveWishlistData
): Promise<{ success: boolean }> => {
  const response = await axiosInstance.post('remove', data)
  return response.data
}
