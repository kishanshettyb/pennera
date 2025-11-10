'use client'

import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/shadcn-io/counter'
import { ArrowRight, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useGetAllCart } from '@/services/query/cart/cart'
import { useUpdateCartItem, useRemoveFromCart } from '@/services/mutation/cart/cart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// describe a single cart item from WooCommerce
type CartItem = {
  key: string
  name: string
  quantity: number
  permalink: string
  images?: { thumbnail?: string; alt?: string }[]
  prices?: { price?: string }
  totals?: { line_total?: string }
}

function CartPage() {
  const { data: cart, isLoading } = useGetAllCart()
  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveFromCart()

  // State to track which items are currently being updated or removed
  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = React.useState<Set<string>>(new Set())
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false)

  const totalItems = cart?.items_count || 0
  const totalPrice = cart?.totals?.total_price || 0
  const currencySymbol = cart?.totals?.currency_symbol || '₹'

  // Handle update cart item with loading state
  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    if (quantity < 1) return

    setUpdatingItems((prev) => new Set(prev).add(itemKey))

    updateCartItem.mutate(
      { key: itemKey, quantity },
      {
        onSettled: () => {
          setUpdatingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(itemKey)
            return newSet
          })
        }
      }
    )
  }

  // Handle remove cart item with loading state
  const handleRemoveItem = (itemKey: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemKey))

    removeCartItem.mutate(itemKey, {
      onSettled: () => {
        setRemovingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(itemKey)
          return newSet
        })
      }
    })
  }

  // Check if any individual item action is pending
  const isAnyItemActionPending = updatingItems.size > 0 || removingItems.size > 0

  const computedSubtotal =
    cart?.items?.reduce((sum, item) => {
      const lineTotal = parseInt(item.totals?.line_total || '0', 10)
      return sum + lineTotal
    }, 0) || 0

  if (isLoading) {
    return (
      <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading your cart...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        {cart?.items?.length === 0 ? (
          <div className="flex flex-col gap-y-5 justify-center items-center w-full py-20">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items Section */}
            <div className="w-full pt-10">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold w-[10%]">Item</TableHead>
                    <TableHead className="font-semibold text-center">Quantity</TableHead>
                    <TableHead className="font-semibold text-center">Subtotal</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(cart.items as CartItem[]).map((item) => {
                    const isUpdating = updatingItems.has(item.key)
                    const isRemoving = removingItems.has(item.key)

                    return (
                      <TableRow
                        key={item.key}
                        className={isUpdating || isRemoving ? 'opacity-50 bg-slate-50' : ''}
                      >
                        {/* Item */}
                        <TableCell>
                          <div className="flex items-center  gap-3">
                            <div className="relative w-[60px]">
                              {(isUpdating || isRemoving) && (
                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded z-10">
                                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                </div>
                              )}
                              <Image
                                src={item.images?.[0]?.thumbnail || '/category/formals.webp'}
                                alt={item.images?.[0]?.alt || item.name}
                                width={64}
                                height={64}
                                className="w-[60px] h-[60px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[100px] md:w-auto lg:w-auto">
                              <Link
                                href={item.permalink}
                                className={`font-medium hover:underline ${
                                  isUpdating || isRemoving ? 'pointer-events-none' : ''
                                }`}
                              >
                                <p className="line-clamp-1 text-xs   lg:text-base">{item.name}</p>
                              </Link>
                              <p className="text-xs text-gray-600 mt-1">
                                {currencySymbol}
                                {(parseInt(item.prices?.price || '0') / 100).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Quantity */}
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Counter
                              number={item.quantity}
                              setNumber={(qty) => handleUpdateQuantity(item.key, qty)}
                              disabled={isUpdating || isRemoving}
                              className="mx-auto"
                            />
                          </div>
                        </TableCell>

                        {/* Subtotal */}
                        <TableCell className="text-center font-semibold">
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            `${currencySymbol}${(
                              parseInt(item.totals?.line_total || '0') / 100
                            ).toLocaleString()}`
                          )}
                        </TableCell>

                        {/* Delete */}
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.key)}
                            disabled={isUpdating || isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Cart Summary */}
            <div className="w-full lg:w-1/4">
              <div className="bg-slate-50 h-fit border border-slate-200 rounded-lg p-6 sticky top-4">
                <h2 className="mb-6 font-semibold text-xl">Cart Totals</h2>

                {/* Subtotal */}
                <div className="flex p-4 border border-dotted border-slate-300 flex-row justify-between items-center mb-4">
                  <div>
                    <p className="opacity-80 font-semibold">Subtotal</p>
                  </div>
                  <div>
                    <p className="opacity-80 font-semibold">
                      {currencySymbol}
                      {(computedSubtotal / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex p-4 flex-row justify-between items-center mb-6">
                  <div>
                    <p className="text-lg font-bold">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {currencySymbol}
                      {(parseInt(totalPrice) / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <div>
                  <Button
                    asChild
                    size="lg"
                    className="w-full cursor-pointer"
                    disabled={isAnyItemActionPending || totalItems === 0}
                    onClick={() => setIsCheckoutLoading(true)}
                  >
                    <Link href="/checkout">
                      {isCheckoutLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Redirecting...
                        </>
                      ) : (
                        <>
                          Proceed to checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Link>
                  </Button>
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full cursor-pointer">
                    <Link href="/shop">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                {/* Tax Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
