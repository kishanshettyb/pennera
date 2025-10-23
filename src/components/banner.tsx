'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

function Banner() {
  return (
    <div>
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 2000
          })
        ]}
        className="w-full  mx-auto"
      >
        <CarouselContent className="-ml-1">
          <CarouselItem className="pl-1 w-full relative">
            <Image
              width="2000"
              height="800"
              src="/banner/web-banner-1.png"
              alt="Disanmart"
              className="w-full h-[33vh] md:h-full object-cover "
            />
            <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%]">
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-7xl font-semibold mb-4 ">
                Elegance in Gold
              </h2>
              <p className="mb-6 text-xs md:text-md lg:text-2xl w-[70%] lg:w-full">
                Timeless jewelry crafted to perfection, from classic to modern designs.
              </p>

              <Button asChild size="lg">
                <Link className="cursor-pointer" href="/shop">
                  Shop Now <ArrowRight />
                </Link>
              </Button>
            </div>
          </CarouselItem>
          <CarouselItem className="pl-1 w-full relative">
            <Image
              width="2000"
              height="800"
              src="/banner/web-banner-2.png"
              alt="Disanmart"
              className="w-full h-[33vh] md:h-full object-cover "
            />
            <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%]">
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-7xl font-semibold mb-4 ">
                Shine Every Moment
              </h2>
              <p className="mb-6 text-xs md:text-md lg:text-2xl w-[70%] lg:w-full">
                Luxury gold jewelry that defines style and elegance.
              </p>
              <Button asChild size="lg">
                <Link className="cursor-pointer" href="/shop">
                  Shop Now <ArrowRight />
                </Link>
              </Button>
            </div>
          </CarouselItem>
          <CarouselItem className="pl-1 w-full relative">
            <Image
              width="2000"
              height="800"
              src="/banner/web-banner-1.png"
              alt="Disanmart"
              className="w-full h-[33vh] md:h-full object-cover "
            />
            <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%]">
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-7xl font-semibold mb-4 ">
                Golden Perfection
              </h2>
              <p className="mb-6 text-xs md:text-md lg:text-2xl w-[70%] lg:w-full">
                Discover exquisite gold pieces for every occasion.
              </p>

              <Button asChild size="lg">
                <Link className="cursor-pointer" href="/shop">
                  Shop Now <ArrowRight />
                </Link>
              </Button>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
