'use client'
import Banner from '@/components/banner'
// import FeaturesBar from '@/components/features-bar'
// import Marquee from '@/components/marquee'
// import PopularProducts from '@/components/popular-products'
// import PopularProductsGrid from '@/components/popular-products-grid'
// import CategorySection from '@/components/product/category-section'
// import { useCustomerData } from '@/hooks/useCustomerData'
// import { useEffect } from 'react'

export default function Home() {
  // const { customerData } = useCustomerData()

  // useEffect(() => {
  //   if (customerData && customerData.length > 0) {
  //     console.log('Customer data fetched:', customerData[0])
  //     console.log('Customer ID stored in context:', customerData[0].id)
  //   }
  // }, [customerData])

  return (
    <div>
      <Banner />
      {/* <section className="py-5 bg-[linear-gradient(to_right,#fdf2f8,#eef2ff,#eff6ff,#ecfdf5)]">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <FeaturesBar />
        </div>
      </section>
      <section className="py-[60px]">
        <PopularProductsGrid />
      </section>

      <section className="py-[60px] bg-[linear-gradient(to_right,#f8fafc,#fafafa,#f8fafc,#fafafa)]">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <CategorySection />
        </div>
      </section>
      <Marquee
        speed={30}
        items={[
          '🔥 Big Sale Today! Up to 50% Off!',
          '🚚 Free Shipping on Orders Over Rs. 999!',
          '💥 New Arrivals Just Landed!',
          '🎁 Limited Time Offer — Grab Now!'
        ]}
      />
      <section className="py-[60px] bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <PopularProducts />
        </div>
      </section> */}
    </div>
  )
}
