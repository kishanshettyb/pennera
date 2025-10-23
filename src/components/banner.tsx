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
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-6xl font-semibold mb-4 ">
                Elegance That Shines Forever
              </h2>
              <p className="mb-4 text-xs md:text-md lg:text-lg w-[70%] lg:w-full">
                Classic to modern designs, Penerra adds luxury to every moment.
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
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-6xl font-semibold mb-4 ">
                Indulge in Exquisite Gold Jewelry That Shines With Every Moment
              </h2>
              <p className="mb-4 text-xs md:text-md lg:text-lg w-[70%] lg:w-full">
                Discover handcrafted designs that blend tradition and contemporary luxury.
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
              <h2 className="animate-fade-in-up  w-[70%] lg:w-full text-2xl md:text-4xl lg:text-6xl font-semibold mb-4 ">
                Where Every Piece of Gold Jewelry Tells a Story of Elegance and Grace
              </h2>
              <p className="mb-4 text-xs md:text-md lg:text-lg w-[70%] lg:w-full">
                Penerra offers timeless creations that celebrate your unique style.
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
