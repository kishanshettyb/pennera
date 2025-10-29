import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { MenuItems } from './menu/menuItems'

function header() {
  return (
    <>
      <div className="w-full hidden lg:block">
        <div className="w-full py-4 mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                className="w-auto h-[60px]"
                src="/logo.png"
                width="1000"
                height="1000"
                alt="Disanmart"
              />
            </Link>
          </div>
          <div>
            <MenuItems />
          </div>
          <div></div>
        </div>
      </div>
    </>
  )
}

export default header
