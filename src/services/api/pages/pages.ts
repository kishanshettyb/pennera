import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAGE_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export const getPagesDetails = async (slug: string) => {
  const response = await axiosInstance.get(`/pages?slug=${slug}`)
  return response.data
}
