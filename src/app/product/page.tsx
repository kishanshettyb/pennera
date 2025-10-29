import ProductDetails from '@/components/products/product-details'
import { Suspense } from 'react'

export default function ProductDetailsPage() {
  return (
    <>
      <Suspense fallback={<>...</>}>
        <ProductDetails />
      </Suspense>
    </>
  )
}
