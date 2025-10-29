'use client'

import React from 'react'
import PageHeading from './page-heading'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Image from 'next/image'
import { useGetAllProducts } from '@/services/query/products/product'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Product } from '@/types/productTypes'

function PopularProducts() {
  const fallbackImage = '/no-image.png'
  const {
    data: products,
    isLoading,
    isError
  } = useGetAllProducts({
    featured: true
  })

  if (isLoading) {
    return <p className="text-center py-10">Loading products...</p>
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Failed to load products.</p>
  }

  if (!products || products.length === 0) {
    return <p className="text-center py-10">No products available.</p>
  }

  return (
    <div>
      <PageHeading
        title="Popular Products"
        desc="Discover the favorites our customers keep coming back for quality, style, and value all in one place."
      />

      <Carousel
        plugins={[
          Autoplay({
            delay: 2000
          })
        ]}
        className="w-full mx-auto"
      >
        <CarouselContent className="-ml-1">
          {products?.map((product: Product) => (
            <CarouselItem
              key={product.id}
              className="pl-1 cursor-pointer sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative"
            >
              <Link href={`/product?slug=${product.slug}`}>
                <div className="p-4">
                  <div>
                    <Image
                      width={1000}
                      height={1000}
                      src={
                        product.images && product.images.length > 0 && product.images[0].src
                          ? product.images[0].src
                          : fallbackImage
                      }
                      alt={product.name ?? 'Penerra'}
                      className="w-full h-[450px] object-cover rounded-2xl transform transition-transform duration-300 hover:scale-105"
                    />

                    <div className="p-4 ">
                      <div className="flex justify-center flex-col text-center items-center mb-2">
                        <div className="flex flex-col">
                          <p className="text-lg max-w-max line-clamp-2 font-semibold  mb-2">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            {product.price_html ? (
                              <span dangerouslySetInnerHTML={{ __html: product.price_html }} />
                            ) : (
                              <>₹{product.price}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  )
}

export default PopularProducts
