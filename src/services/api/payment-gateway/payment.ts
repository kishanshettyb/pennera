import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

// ✅ Get all payment gateways
export const getAllPaymentGateways = async () => {
  const response = await axiosInstance.get('payment_gateways', {
    params: { context: 'view' } // optional param
  })
  return response.data
}
