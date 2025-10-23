import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export const getAllCategory = async () => {
  const response = await axiosInstance.get('products/categories?per_page=100')
  return response.data
}
