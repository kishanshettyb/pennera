import axios from 'axios'
import Cookies from 'js-cookie'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*'
  }
})
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('jwt_token')

  if (token) {
    // Logged-in user → Use JWT token
    config.headers.Authorization = `Bearer ${token}`
    if (config.auth) delete config.auth // remove Basic Auth if added accidentally
  } else {
    // Guest user → Use Basic Auth
    config.auth = {
      username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
      password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
    }
  }

  // Always include WC nonce if available
  const nonce = getCookie('wc_nonce')
  if (nonce) {
    config.headers.Nonce = nonce
  }

  return config
})

/* --------------------------- HELPERS --------------------------- */

// Simple cookie reader (SSR-safe)
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

/* --------------------------- NONCE FETCHER --------------------------- */

export const getStoreNonceToken = async () => {
  try {
    const response = await axios.get('/api/cart')
    const nonce = response.headers['nonce']

    if (nonce) {
      Cookies.set('wc_nonce', nonce, { path: '/', sameSite: 'strict' })
      return nonce
    } else {
      console.warn('⚠️ Nonce header not found in response')
      return null
    }
  } catch (error) {
    console.error('❌ Error fetching nonce:', error)
    return null
  }
}

/* --------------------------- CART APIS --------------------------- */

// ✅ Get Cart (works for both guest + logged-in)
export const getAllCart = async () => {
  const response = await axiosInstance.get('cart')
  return response.data
}

// ✅ Add Item to Cart
export const addToCart = async (data: {
  id: number
  quantity: number
  variation?: { attribute: string; value: string }[]
}) => {
  const response = await axiosInstance.post('cart/add-item', data)
  return response.data
}

// ✅ Remove Item from Cart
export const removeFromCart = async (key: string) => {
  const response = await axiosInstance.post(`cart/remove-item?key=${key}`)
  return response.data
}

// ✅ Update Cart Item Quantity
export const updateCartItem = async (key: string, quantity: number) => {
  const response = await axiosInstance.post(`cart/update-item?key=${key}&quantity=${quantity}`, {})
  return response.data
}

export const applyCouponCart = async (data: { code: string }) => {
  const response = await axiosInstance.post(`cart/apply-coupon`, data)
  return response.data
}

export const removeCouponCart = async (payload: { code: string }) => {
  const response = await axiosInstance.delete(`cart/coupons`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload
  })
  return response.data
}
