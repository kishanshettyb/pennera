import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export const getAllOrders = async (customerId: string) => {
  const response = await axiosInstance.get(`orders?customer=${customerId}`)
  return response.data
}

export const getOrderByOrderId = async (orderId: string) => {
  const response = await axiosInstance.get(`orders/${orderId}`)
  return response.data
}

export const updateOrderByOrderId = async (orderId: string, data) => {
  const response = await axiosInstance.put(`orders/${orderId}`, data)
  return response.data
}
