import { StaticImport } from 'next/dist/shared/lib/get-img-props'

export interface ProductImage {
  src?: string | StaticImport
}

export interface ProductProps {
  id?: number
  images?: ProductImage[]
  name?: string
  price_html?: string | null
  price?: string
  slug?: string
}

export interface ProductAttribute {
  id: number
  name: string
  slug: string
  variation: boolean
  visible: boolean
  options: string[]
}

export interface Product {
  id: number
  price: number
  name: string
  short_description: string
  description: string
  regular_price: string
  sale_price: string
  stock_status: string
  price_html: string
  sku: string
  rating_count: number
  slug: string
  attributes: ProductAttribute[]
  images: { src: string | StaticImport }[]
  variations: number[]
  default_attributes: {
    id: number
    name: string
    option: string
  }[]
}
