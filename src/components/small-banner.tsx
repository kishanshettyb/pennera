import Image from 'next/image'
import React from 'react'

type SmallBannerProps = {
  title: string
  image: string
}
function SmallBanner({ title, image }: SmallBannerProps) {
  return (
    <div className="relative">
      <Image
        src={image}
        alt=""
        width="1920"
        height="800"
        className={`  w-full object-cover h-[30vh] md:h-[35vh] lg:h-[40vh]  `}
      />
      <h2 className="text-2xl lg:text-4xl font-bold absolute top-[50%] left-[50%]  transform translate-[-50%]  text-white">
        {title}
      </h2>
    </div>
  )
}

export default SmallBanner
