'use client'

import * as React from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/shadcn-io/counter'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import Link from 'next/link'
import Image from 'next/image'
import { useGetAllCart } from '@/services/query/cart/cart'
import { useUpdateCartItem, useRemoveFromCart } from '@/services/mutation/cart/cart'
import { LoginRegisterModal } from './login-register-modal'

/* -------------------- TYPES -------------------- */
interface CartItem {
  key: string
  name: string
  quantity: number | string
  permalink: string
  images?: { thumbnail?: string; alt?: string }[]
  prices?: { price?: string | number }
  totals?: { line_total?: string | number }
}

interface Coupon {
  code: string
  discount_type?: string
  totals?: {
    total_discount?: string | number
    total_discount_amount?: string | number
  }
}

interface CartTotals {
  total_price?: string | number
  subtotal?: string | number
  currency_symbol?: string
}

interface CartData {
  items?: CartItem[]
  items_count?: number
  totals?: CartTotals
  coupons?: Coupon[]
}

interface CartDetailsProps {
  isOpen: boolean
  onClose: () => void
}

/* -------------------- HELPERS -------------------- */
function parseIntSafe(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'number') return Math.round(v)
  const cleaned = String(v).replace(/[^\d-]/g, '')
  const n = parseInt(cleaned, 10)
  return isNaN(n) ? 0 : n
}

function formatCurrencyFromPaise(valuePaise: number, symbol = '₹'): string {
  const rupees = valuePaise / 100
  return `${symbol}${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/* -------------------- COMPONENT -------------------- */
export function CartSidebar({ isOpen, onClose }: CartDetailsProps) {
  const { data: cart, isLoading } = useGetAllCart() as {
    data: CartData | undefined
    isLoading: boolean
  }
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveFromCart()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const checkLoginStatus = () => setIsLoggedIn(localStorage.getItem('session') === 'true')
    checkLoginStatus()
    window.addEventListener('storage', checkLoginStatus)
    return () => window.removeEventListener('storage', checkLoginStatus)
  }, [])

  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = React.useState<Set<string>>(new Set())

  const totalItems = cart?.items_count || 0
  const currencySymbol = cart?.totals?.currency_symbol || '₹'

  /* -------------------- CALCULATIONS -------------------- */
  const calculatedSubtotal =
    cart?.items?.reduce((acc, item) => {
      const price = parseIntSafe(item.prices?.price)
      const qty = parseIntSafe(item.quantity)
      return acc + price * qty
    }, 0) || 0

  let couponDiscount = 0
  let appliedCoupons: string[] = []

  if (Array.isArray(cart?.coupons) && cart.coupons.length > 0) {
    couponDiscount = cart.coupons.reduce((acc, coupon) => {
      const val = parseIntSafe(
        coupon.totals?.total_discount ?? coupon.totals?.total_discount_amount ?? 0
      )
      return acc + val
    }, 0)
    appliedCoupons = cart.coupons.map((c) => c.code).filter(Boolean)
  }

  const finalTotal = Math.max(0, calculatedSubtotal - couponDiscount)

  /* -------------------- MUTATION HANDLERS -------------------- */
  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemKey))
    updateCartItem.mutate(
      { key: itemKey, quantity },
      {
        onSettled: () =>
          setUpdatingItems((prev) => {
            const next = new Set(prev)
            next.delete(itemKey)
            return next
          })
      }
    )
  }

  const handleRemoveItem = (itemKey: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemKey))
    removeCartItem.mutate(itemKey, {
      onSettled: () =>
        setRemovingItems((prev) => {
          const next = new Set(prev)
          next.delete(itemKey)
          return next
        })
    })
  }

  const isAnyActionPending = updatingItems.size > 0 || removingItems.size > 0

  /* -------------------- RENDER -------------------- */
  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <DrawerHeader className="border border-x-0 border-t-0 border-b-slate-200">
            <DrawerTitle className="flex items-center gap-2">
              <span className="text-xl font-semibold">Your Cart</span>
            </DrawerTitle>
            <div className="absolute right-5 top-5">
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" disabled={isAnyActionPending} onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Items */}
          <div className="p-4 pb-0 space-y-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading cart...</span>
              </div>
            ) : cart?.items?.length ? (
              cart.items.map((item) => {
                const isUpdating = updatingItems.has(item.key)
                const isRemoving = removingItems.has(item.key)
                const isDisabled = isUpdating || isRemoving

                const itemPrice = parseIntSafe(item.prices?.price)
                const qty = parseIntSafe(item.quantity)
                const itemTotal = itemPrice * qty

                return (
                  <div
                    key={item.key}
                    className={`flex gap-3 items-center justify-between border-b border-gray-200 pb-3 ${
                      isDisabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="w-[70px] h-[80px] relative">
                      {isDisabled && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded z-10">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        </div>
                      )}
                      <Image
                        src={item.images?.[0]?.thumbnail || '/placeholder.png'}
                        alt={item.images?.[0]?.alt || item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={item.permalink}
                          className={`font-medium hover:underline text-xs line-clamp-1 ${
                            isDisabled ? 'pointer-events-none' : ''
                          }`}
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrencyFromPaise(itemPrice, currencySymbol)} × {qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Counter
                          number={qty}
                          setNumber={(newQty) => handleUpdateQuantity(item.key, newQty)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleRemoveItem(item.key)}
                          disabled={isDisabled}
                        >
                          {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="font-semibold">
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        formatCurrencyFromPaise(itemTotal, currencySymbol)
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">Your cart is empty</div>
            )}
          </div>

          {/* Footer */}
          <DrawerFooter className="bottom-0 absolute w-full bg-white p-0">
            {/* Coupon Section */}
            {appliedCoupons.length > 0 && (
              <div className="px-4 border-t border-slate-200 pt-3 space-y-1">
                {appliedCoupons.map((code) => (
                  <div key={code} className="flex justify-between items-center text-slate-600">
                    <span className="text-xs">
                      Coupon Applied: <span className="font-semibold">{code}</span>
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm font-medium">Coupon Discount</span>
                  <span className="text-sm font-medium">
                    -{formatCurrencyFromPaise(couponDiscount, currencySymbol)}
                  </span>
                </div>
              </div>
            )}

            {/* Final Total */}
            <div className="px-4 flex justify-between items-center pt-3 border-t border-slate-200">
              <h2 className="text-lg font-semibold">Subtotal</h2>
              <h2 className="text-lg font-semibold">
                {isAnyActionPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  formatCurrencyFromPaise(finalTotal, currencySymbol)
                )}
              </h2>
            </div>

            <div className="px-4 py-2">
              <p className="text-xs opacity-80">Taxes and shipping calculated at checkout</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-y-4 md:flex-row gap-x-4 justify-between items-center px-4 mb-5">
              <div>
                <DrawerClose asChild>
                  <Link href="/cart">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full cursor-pointer"
                      disabled={isAnyActionPending}
                    >
                      View Cart
                    </Button>
                  </Link>
                </DrawerClose>
              </div>
              <div>
                {isLoggedIn ? (
                  <DrawerClose asChild>
                    <Button
                      asChild
                      size="lg"
                      className="w-full"
                      disabled={isAnyActionPending || totalItems === 0}
                      onClick={onClose}
                    >
                      <Link href="/checkout">
                        {isAnyActionPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </Link>
                    </Button>
                  </DrawerClose>
                ) : (
                  <LoginRegisterModal />
                )}
              </div>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
