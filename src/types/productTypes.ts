// src/types/productTypes.ts
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

export interface ProductImage {
  src: string | StaticImport
}

export interface Product {
  id: number
  name: string
  price: string
  price_html?: string
  slug: string
  images: ProductImage[]
}
