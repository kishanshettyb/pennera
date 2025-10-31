import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function VideoBanner() {
  return (
    <div className="relative z-10 bg-black">
      <video
        width="1920"
        height="1920"
        preload="none"
        autoPlay
        muted
        loop
        className="w-full h-[50vh] lg:h-full"
        playsInline
      >
        <source src="/banner/banner.mp4" type="video/mp4" />
        <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-[#00000041] lg:bg-[#00000069] w-full h-full absolute top-0"></div>
      <div className="absolute w-[80%] top-[70%] md:top-[50%] lg:top-[50%] left-[50%] transform translate-x-[-50%]  translate-y-[-50%] ">
        <h2 className="text-xl md:text-4xl lg:text-6xl uppercase text-center mb-2 lg:mb-5 text-white font-semibold">
          Where Tradition Meets Modern Power.
        </h2>
        <p className="text-white    text-xs md:text-lg lg:text-lg mb-2 lg:mb-5 opacity-60 text-center">
          Elevate your presence with handcrafted men&apos;s gold jewelry from Penerra.
        </p>
        <div className="flex justify-center items-center w-auto">
          <Button variant="ghost" asChild className="text-white">
            <Link href="/shop">
              Shop Now <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VideoBanner
