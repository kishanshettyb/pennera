import React from 'react'
import OrderDetails from '@/components/order-details'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function OrderComplete() {
  return (
    <>
      <section className="py-10 border border-x-0 border-b-0">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <div>
            <div className="bg-green-50 flex justify-center items-center w-fit mx-auto p-6 rounded-xl shadow-2xl shadow-green-50 min-w-fit text-green-600 border border-green-600 ">
              <h2 className="text-xl font-semibold text-center">
                Thank you. Your order has been received
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className="py-0 pb-20   border border-x-0 border-b-0">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <div>
            <div className="my-10">
              <OrderDetails />
            </div>
            <div className="flex mt-10 justify-center items-center ">
              <Button size="lg" asChild>
                <Link href="/">
                  <ArrowLeft />
                  Go to home page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OrderComplete
