import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export const changeCustomerPassword = async (customerId: number, newPassword: string) => {
  const response = await axiosInstance.put(
    `customers/${customerId}`,
    {
      password: newPassword
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return response.data
}
