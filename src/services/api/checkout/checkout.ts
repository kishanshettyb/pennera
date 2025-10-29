import { CheckoutCartData } from '@/types/checkoutTypes'
import axios from 'axios'

// 🔹 Utility: Get cookie value
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// 🔹 Axios instances
const axiosGuestInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_URL
})

// 🔹 Add Bearer token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('jwt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 🔹 Helper: Choose correct instance dynamically
function getAxiosClient() {
  const token = getCookie('jwt_token')
  return token ? axiosInstance : axiosGuestInstance
}

// 🔹 Checkout order by ID
export const checkoutOrder = async (orderId: number, data: unknown) => {
  const nonce = getCookie('wc_nonce')
  const client = getAxiosClient()

  const response = await client.post(`checkout/${orderId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      Nonce: nonce || ''
    }
  })

  return response.data
}

// 🔹 Get checkout data
export const getCheckoutData = async () => {
  const nonce = getCookie('wc_nonce')
  const client = getAxiosClient()

  const response = await client.get('checkout', {
    headers: {
      'Content-Type': 'application/json',
      Nonce: nonce || ''
    }
  })

  return response.data
}

// 🔹 Checkout cart
export const checkoutCart = async (data: CheckoutCartData) => {
  const nonce = getCookie('wc_nonce')
  const client = getAxiosClient()

  const response = await client.post(`checkout`, data, {
    headers: {
      'Content-Type': 'application/json',
      Nonce: nonce || ''
    }
  })

  return response.data
}
