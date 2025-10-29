import * as React from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

type GalleryImageProps = {
  id?: number
  src?: string | StaticImport
  name?: string
  alt?: string
  srcset?: string
  sizes?: string
  thumbnail?: string
}

export function ProductGallery({ images }: { images: GalleryImageProps[] }) {
  const fallbackImage = '/no-image.png'

  if (!images || images.length === 0) return null
  return (
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
      className="w-full  "
    >
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img.id}>
            <div className="p-1">
              <Image
                src={img.src ?? fallbackImage}
                alt={img.name ?? 'Penerra'}
                width="1000"
                height="1000"
                className="w-full h-auto object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden lg:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}
