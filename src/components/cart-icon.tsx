'use client'

import * as React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useGetAllCart } from '@/services/query/cart/cart'
import { useHeaderStore } from '@/store/useHeaderStore'

interface CartIconProps {
  onClick: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const { data: cart } = useGetAllCart()
  const totalItems = cart?.items_count || 0
  const isFixed = useHeaderStore((state) => state.isFixed)

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <span className="inline-flex absolute shadow-xl shadow-red-700 -top-3 -right-3 w-[20px] h-[20px] rounded-full bg-red-600 justify-center items-center text-white text-xs font-semibold">
        {totalItems}
      </span>
      <ShoppingBag
        className={`hover:animate-pulse ${isFixed ? `text-white` : `text-black`}`}
        size="20"
      />
    </div>
  )
}
