import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})
export const getCustomerByEmail = async (email: string) => {
  const response = await axiosInstance.get(`customers?email=${email}`)
  return response.data
}

export const createCustomer = async (data: FormData) => {
  const response = await axiosInstance.post('customers', data)
  return response.data
}

export const loginCustomer = async (data: { username: string; password: string }) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_LOGIN_URL}token`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

export const getCustomerById = async (customerId: number) => {
  const response = await axiosInstance.get(`customers/${customerId}`)
  return response.data
}

export const updateCustomer = async (customerId: number, data: unknown) => {
  const response = await axiosInstance.post(`customers/${customerId}`, data)
  return response.data
}
