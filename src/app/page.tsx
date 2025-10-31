'use client'
import ProductImage from '@/components/productImage'
import CategorySection from '@/components/products/category-section'
import VideoBanner from '@/components/video-banner'

export default function Home() {
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
    </div>
  )
}
