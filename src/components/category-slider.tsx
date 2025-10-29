import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import PageHeading from '@/components/page-heading'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'

type Category = {
  id: number
  categoryName: string
  totalItems: number
  categoryImage?: string
  slug: string
  display: string
  subcategories: Subcategory[]
}

type Subcategory = {
  id: number
  name: string
  slug: string
  count: number
  image?: {
    src: string
  }
}

type CategorySliderProps = {
  items: Category[]
}

function CategorySlider({ items }: CategorySliderProps) {
  return (
    <div>
      <PageHeading
        title="A Collection for Every Occasion"
        desc="Celebrate love, beauty, and tradition with Penerra's handcrafted jewelry — designed to bring out your inner radiance."
      />
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 3000
          })
        ]}
        className="w-full mx-auto "
      >
        <CarouselContent className="-ml-1">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-1 cursor-pointer sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/shop?category=${item.id}`}>
                <div className="p-4">
                  <div className="bg-white rounded-2xl  overflow-hidden">
                    {item.categoryImage && (
                      <Image
                        width="1000"
                        height="1000"
                        src={item.categoryImage}
                        alt={item.categoryName}
                        className="w-full h-[300px] lg:h-[400px] object-cover  rounded-2xl "
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <p className="text-xl font-semibold truncate">{item.categoryName}</p>
                          <p className="text-sm text-gray-600">{item.totalItems} items</p>
                        </div>
                        <div>
                          <div className="w-[35px] h-[35px] bg-slate-900 rounded-full text-white flex text-center justify-center items-center">
                            <ArrowRight size="22" />
                          </div>
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

export default CategorySlider
