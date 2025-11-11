'use client'
import CategoryLinks from '@/components/categoryLinks'
import ProductImage from '@/components/productImage'
import CategorySection from '@/components/products/category-section'
import VideoBanner from '@/components/video-banner'
import { useCustomerData } from './hooks/useCustomerData'
import { useEffect } from 'react'

export default function Home() {
  const { customerData } = useCustomerData()

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      console.log('Customer data fetched:', customerData[0])
      console.log('Customer ID stored in context:', customerData[0].id)
    }
  }, [customerData])
  return (
    <div>
      <VideoBanner />
      <CategorySection />
      <section>
        <div className="flex flex-row justify-between">
          <div className="w-1/2">
            <ProductImage
              link="/shop"
              btnTitle="Shop Now"
              title="Signature Gold Rings"
              desc="Bold designs crafted to reflect confidence."
              imageSource="/popular/prod-1.png"
            />
          </div>
          <div className="w-1/2">
            <ProductImage
              link="/shop"
              btnTitle="Shop Now"
              title="Royal Kada Collection"
              desc="Symbol of power and tradition."
              imageSource="/popular/prod-2.png"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-1/2">
            <ProductImage
              isCenter={true}
              link="/shop"
              btnTitle="Shop Now"
              title="Signature Gold Rings"
              desc="Bold designs crafted to reflect confidence."
              imageSource="/popular/prod-3.png"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <ProductImage
              isCenter={true}
              link="/shop"
              btnTitle="Shop Now"
              title="Royal Kada Collection"
              desc="Symbol of power and tradition."
              imageSource="/popular/prod-4.png"
            />
          </div>
        </div>
      </section>
      <CategoryLinks />
    </div>
  )
}
