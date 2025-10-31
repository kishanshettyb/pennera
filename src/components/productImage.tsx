import Image from 'next/image'
import React from 'react'
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
      <div className="absolute w-full z-50 bottom-4 lg:bottom-15 left-5 lg:left-10">
        <h2 className="text-white text-md md:text-2xl lg:text-3xl font-semibold mb-0 lg:mb-3">
          {title}
        </h2>
        <p className="text-white hidden md:block text-xs lg:text-md mb-5 opacity-80">{desc}</p>

        <Link
          href={link}
          className=" inline-flex justify-start items-center gap-x-2 opacity-70 hover:opacity-100 text-white text-xs md:text-base"
        >
          {btnTitle}
          <ArrowRight size="20" />
        </Link>
      </div>
    </div>
  )
}

export default ProductImage
