import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <section className="bg-[#f8fafb] ">
      <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold mt-5 lg:mt-0">About Us</h2>
            <p className="opacity-80 text-sm">
              At Penerra, we believe jewelry is more than adornment — it&apos;s an expression of
              love, beauty, and individuality. Our handcrafted collections are designed to celebrate
              life&apos;s most precious moments with timeless elegance and modern artistry.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold mt-5 lg:mt-0">Quick Links</h2>
            <ul>
              <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                <Link href="/">Home</Link>
              </li>
              <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                <Link href="/about">About Us</Link>
              </li>
              <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                <Link href="/shop">Shop</Link>
              </li>
              <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                <Link href="/categories">Categories</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold mt-5 lg:mt-0">Company</h2>
            <ul>
              <ul>
                <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                  <Link href="/account">Account</Link>
                </li>
                <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                  <Link href="/account/orders">Orders</Link>
                </li>

                <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li className="text-sm mb-2 cursor-pointer hover:text-blue-600">
                  <Link href="/account/wishlist">Wishlist</Link>
                </li>
              </ul>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold mt-5 lg:mt-0">Contact</h2>
            <p className="mb-2 text-sm">
              Penerra Private Limited
              <br /> GST: 29AAHCD845XXXX <br /> Address:GROUND FLOOR, 2947, Pooja Pushpa, 13th Main
              Road, 2nd Stage, Rajajinagar,Bengaluru, Karnataka, India, 560010
            </p>
            <Link className="cursor-pointer hover:text-blue-600" href="tel:+91 93615 44343">
              <p className="mb-2 text-sm">+91 93615 44343</p>
            </Link>
            <Link
              className="cursor-pointer hover:text-blue-600"
              href="mailto:support@disanmart.com"
            >
              <p className="mb-2 text-sm">support@penerra.in</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t-slate-200 border border-x-0 border-b-0 py-8">
        <div className="w-full  mx-auto px-4  sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <div className="flex flex-col lg:flex-row justify-center items-center mx-auto lg:justify-between text-center  gap-2 gap-y-4">
            <div>
              <p className="text-sm">&copy; 2025. All Rights Reserved</p>
            </div>
            <div className="grid grid-cols-5 gap-1">
              <div>
                <p className="text-sm hover:text-blue-600">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </p>
              </div>
              <div>
                <p className="text-sm hover:text-blue-600">
                  <Link href="/terms-and-conditions">Terms & Conditions</Link>
                </p>
              </div>
              <div>
                <p className="text-sm hover:text-blue-600">
                  <Link href="/refund-policy">Refund Policy</Link>
                </p>
              </div>
              <div>
                <p className="text-sm hover:text-blue-600">
                  <Link href="/shipping-policy">Shipping Policy</Link>
                </p>
              </div>
              <div>
                <p className="text-sm hover:text-blue-600">
                  <Link href="/return-policy">Return Policy</Link>
                </p>
              </div>
            </div>
            <div className="flex  gap-2">
              <div>
                <Image
                  src="/icons/visa.svg"
                  alt="icon"
                  width="100"
                  height="100"
                  className="w-[45px] h-auto"
                />
              </div>
              <div>
                <Image
                  src="/icons/mastercard.svg"
                  alt="icon"
                  width="100"
                  height="100"
                  className="w-[45px] h-auto"
                />
              </div>
              <div>
                <Image
                  src="/icons/paypall.svg"
                  alt="icon"
                  width="100"
                  height="100"
                  className="w-[45px] h-auto"
                />
              </div>
              <div>
                <Image
                  src="/icons/discovery.svg"
                  alt="icon"
                  width="100"
                  height="100"
                  className="w-[45px] h-auto"
                />
              </div>
              <div>
                <Image
                  src="/icons/shop.svg"
                  alt="icon"
                  width="100"
                  height="100"
                  className="w-[45px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer
