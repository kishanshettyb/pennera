import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  auth: {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }
})

export type GetAllProductsParams = {
  context?: 'view' | 'edit'
  featured?: boolean
  page?: number
  per_page?: number
  slug?: string
  search?: string
  category?: string
  orderby?: 'date' | 'price' | 'popularity' | 'rating' | 'title'
  order?: 'asc' | 'desc'
  min_price?: number
  max_price?: number
  attribute?: string // e.g. "pa_color"
  attribute_term?: string // e.g. "15"
  pageParam?: number
}
/* eslint-disable */

export const getAllProducts = async (params: GetAllProductsParams = {}) => {
  // remove undefined values so the API doesn’t receive junk
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))

  const response = await axiosInstance.get('products', {
    params: {
      context: 'view',
      ...cleanParams
    }
  })
  /* eslint-enable */

  return response.data
}

export const getAllProductsPagination = async ({
  pageParam = 1,
  ...params
}: GetAllProductsParams) => {
  try {
    const response = await axiosInstance.get('products', {
      params: {
        context: 'view',
        per_page: 20, // fetch 10 per page
        page: pageParam,
        ...params
      }
    })

    // ✅ WooCommerce returns array of products
    return response.data
  } catch (error) {
    console.error('Error fetching paginated products:', error)
    throw error
  }
}
