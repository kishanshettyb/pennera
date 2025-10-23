import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export const getAllShippingClasses = async () => {
  const response = await axiosInstance.get('products/shipping_classes?context=view')
  return response.data
}

export const getAllTaxes = async () => {
  const response = await axiosInstance.get('taxes?context=view')
  return response.data
}

export const getAllShippingMethod = async () => {
  const response = await axiosInstance.get('shipping_methods?context=view&context=view')
  return response.data
}
