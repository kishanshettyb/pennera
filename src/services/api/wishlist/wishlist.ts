import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WISHLIST_URL
})

export const getAllWishlist = async (user_id: number) => {
  const response = await axiosInstance.get(`list`, {
    params: { user_id }
  })
  return response.data
}

export const addToWishlist = async (data) => {
  const response = await axiosInstance.post('add', data)
  return response.data
}

export const removeFromWishlist = async (data) => {
  const response = await axiosInstance.post('remove', data)
  return response.data
}
