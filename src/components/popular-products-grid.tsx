import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

function PopularProductsGrid() {
  return (
    <div className="w-full py-10 mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex justify-between">
      <div className="flex  gap-4 flex-col lg:flex-row">
        <div className="basis-1/2  overflow-hidden h-full relative">
          <Image
            src="/popular/banner1.webp"
            width="2000"
            height="2000"
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            alt=""
          />
          <div className="w-1/2 h-full">
            <div className="flex h-[70%] lg:h-[50%]  absolute   top-[50%] transform translate-y-[-50%]  left-5 lg:left-10 flex-col justify-between items-start ">
              <div className="bg-white text-sm max-w-max px-4 py-1 rounded-2xl">
                Popular Products
              </div>
              <div>
                <h2 className="text-4xl font-semibold mb-2">Top Fashion Deals</h2>
                <p>Save upto 50% OFF</p>
              </div>
              <div>
                <Button asChild size="lg">
                  <Link href="/shop">
                    Shop Now <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-1/2">
          <div className="flex flex-col gap-4">
            <div className="grid gap-4	 grid-cols-2">
              <div className="overflow-hidden relative">
                <Image
                  src="/popular/banner2.webp"
                  width="2000"
                  height="2000"
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                  alt=""
                />
                <div className="w-full h-full">
                  <div className="flex absolute  top-2 lg:top-10   left-[50%] transform translate-x-[-50%]       ">
                    <h2 className="text-xl font-semibold">Trendy Eyeware</h2>
                  </div>
                  <div className="flex absolute  bottom-2 lg:bottom-10   left-[50%] transform translate-x-[-50%]   ">
                    <Button asChild variant="ghost">
                      <Link className="cursor-pointer" href="/shop?category=37">
                        Shop Now <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden relative">
                <Image
                  src="/popular/banner3.webp"
                  width="2000"
                  height="2000"
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                  alt=""
                />
                <div className="w-full h-full">
                  <div className="flex absolute h-full top-5 lg:top-10 left-10 flex-col justify-start items-start">
                    <div>
                      <h2 className="text-xl font-semibold"> Footwear</h2>
                    </div>
                    <div className="-ml-3">
                      <Button asChild variant="ghost">
                        <Link className="cursor-pointer" href="/shop?category=21">
                          Shop Now <ArrowRight />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden relative">
              <Image
                src="/popular/banner4.webp"
                width="2000"
                height="2000"
                className="w-full h-full transform transition-transform duration-300 hover:scale-105"
                alt=""
              />
              <div className="w-full h-full">
                <div className="flex h-[70%] lg:h-[50%]  absolute   top-[50%] transform translate-y-[-50%]  left-5 lg:left-10 flex-col justify-between items-start ">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Fashionable bags for every day</h2>
                    <p>Save upto 50% OFF</p>
                  </div>
                  <div>
                    <Button asChild size="lg">
                      <Link className="cursor-pointer" href="/shop?category=37">
                        Shop Now <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopularProductsGrid
