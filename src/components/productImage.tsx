import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type prodImage = {
  imageSource: string
  title: string
  desc: string
  link: string
  btnTitle?: string
}
function ProductImage({ imageSource, title, desc, link, btnTitle }: prodImage) {
  return (
    <div className="relative">
      <Image
        alt={title}
        src={imageSource}
        width={1920}
        height={1920}
        className="w-full h-full object-cover"
      />
      <div className="absolute z-50 bottom-15 left-10">
        <h2 className="text-white text-3xl font-semibold mb-3">{title}</h2>
        <p className="text-white mb-5 opacity-80">{desc}</p>
        <Button variant="ghost" asChild className="text-white border opacity-50 hover:opacity-100">
          <Link href={link}>
            {btnTitle}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default ProductImage
