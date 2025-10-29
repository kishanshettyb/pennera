import { CreditCard, Headset, ShieldCheck, Truck } from 'lucide-react'
import React from 'react'

function FeaturesBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <div className="flex  rounded-2xl justify-start gap-x-5 p-2 items-start">
        <div>
          <Truck className="opacity-80" size="30" />
        </div>
        <div>
          <h2 className="text-lg xl:text-xl font-semibold mb-1 lg:mb-2">Free Shipping & Return</h2>
          <p className="text-xs opacity-60">Free Shipping for all order over $100</p>
        </div>
      </div>
      <div className="flex  rounded-2xl justify-start gap-x-5 p-2 items-start">
        <div>
          <Headset className="opacity-80" size="30" />
        </div>
        <div>
          <h2 className="text-lg xl:text-xl font-semibold mb-1 lg:mb-2">Online Support</h2>
          <p className="text-xs opacity-60">24 hours a day, 7 days a week</p>
        </div>
      </div>
      <div className="flex  rounded-2xl justify-start gap-x-5 p-2 items-start">
        <div>
          <CreditCard className="opacity-80" size="30" />
        </div>
        <div>
          <h2 className="text-lg xl:text-xl font-semibold mb-1 lg:mb-2">Secure Payment</h2>
          <p className="text-xs opacity-60">Pay with Multiple Credit Cards</p>
        </div>
      </div>
      <div className="flex  rounded-2xl justify-start gap-x-5 p-2 items-start">
        <div>
          <ShieldCheck className="opacity-80" size="30" />
        </div>
        <div>
          <h2 className="text-lg xl:text-xl font-semibold mb-1 lg:mb-2">Money Guarantee</h2>
          <p className="text-xs opacity-60">Within 30 days for an exchange.</p>
        </div>
      </div>
    </div>
  )
}

export default FeaturesBar
