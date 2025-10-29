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
// import { LoginRegisterModal } from './login-register-modal'

type CartItem = {
  key: string
  name: string
  quantity: number
  permalink: string
  images?: { thumbnail?: string; alt?: string }[]
  prices?: { price?: string }
  totals?: { line_total?: string }
}

interface CartDetailsProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartDetailsProps) {
  const { data: cart, isLoading } = useGetAllCart()
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveFromCart()
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const checkLoginStatus = () => {
      const session = localStorage.getItem('session')
      setIsLoggedIn(session === 'true')
    }

    checkLoginStatus()
    window.addEventListener('storage', checkLoginStatus)
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = React.useState<Set<string>>(new Set())

  const totalItems = cart?.items_count || 0
  const totalPrice = cart?.totals?.total_price || 0
  const currencySymbol = cart?.totals?.currency_symbol || '₹'

  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemKey))
    updateCartItem.mutate(
      { key: itemKey, quantity },
      {
        onSettled: () =>
          setUpdatingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(itemKey)
            return newSet
          })
      }
    )
  }

  const handleRemoveItem = (itemKey: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemKey))
    removeCartItem.mutate(itemKey, {
      onSettled: () =>
        setRemovingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemKey)
          return newSet
        })
    })
  }

  const isAnyActionPending = updatingItems.size > 0 || removingItems.size > 0

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
              (cart.items as CartItem[]).map((item) => {
                const isUpdating = updatingItems.has(item.key)
                const isRemoving = removingItems.has(item.key)
                const isItemDisabled = isUpdating || isRemoving

                return (
                  <div
                    key={item.key}
                    className={`flex gap-3 items-center border-b border-gray-200 pb-3 ${
                      isItemDisabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="w-16 h-16 relative">
                      {isItemDisabled && (
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
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        <Link
                          href={item.permalink}
                          className={`font-medium hover:underline text-xs line-clamp-1 ${
                            isItemDisabled ? 'pointer-events-none' : ''
                          }`}
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {currencySymbol}
                          {(parseInt(item.prices?.price || '0') / 100).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Counter
                          number={item.quantity}
                          setNumber={(qty) => handleUpdateQuantity(item.key, qty)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleRemoveItem(item.key)}
                          disabled={isItemDisabled}
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
                        `${currencySymbol}${(
                          parseInt(item.totals?.line_total || '0') / 100
                        ).toLocaleString()}`
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
          <DrawerFooter className="bottom-0 absolute w-full bg-white pt-4">
            <div className="px-4 border-t border-slate-200 flex justify-between items-center pt-2 mb-0">
              <h2 className="text-xl font-semibold">Subtotal</h2>
              <h2 className="text-xl font-semibold">
                {isAnyActionPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  `${currencySymbol}${(parseInt(totalPrice) / 100).toLocaleString()}`
                )}
              </h2>
            </div>

            <div className="px-4 mb-5">
              <p className="text-xs opacity-80">Taxes and shipping calculated at checkout</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-y-5 md:flex-row gap-x-5 justify-between items-center px-4 mb-5">
              <div className="w-full lg:w-1/4">
                <DrawerClose asChild>
                  <Link href="/cart">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full cursor-pointer"
                      disabled={isAnyActionPending}
                      onClick={onClose}
                    >
                      View Cart
                    </Button>
                  </Link>
                </DrawerClose>
              </div>

              <div className="w-full lg:w-3/4">
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
