'use client'

import { Button } from '@/components/ui/button'
import { Trash2, Loader2, ArrowLeft, Heart, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { useGetAllWishlist } from '@/services/query/wishlist/wishlist'
import { useRemoveFromWishlist } from '@/services/mutation/wishlist/wishlist'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAddToCart } from '@/services/mutation/cart/cart'
import { CartSidebar } from '@/components/cart-sidebar'
import { useCustomerContext } from '@/use-customer-context'

// Wishlist item type based on your API response
type WishlistItem = {
  id: number
  name: string
  price: string
  image: string
}

function Wishlist() {
  const { customerId, isAuthenticated } = useCustomerContext()
  const { data: wishlistData, isLoading, refetch } = useGetAllWishlist(customerId!)
  const removeFromWishlist = useRemoveFromWishlist()
  const { mutate: addToCart } = useAddToCart()

  // State to track which items are currently being removed
  const [removingItems, setRemovingItems] = React.useState<Set<number>>(new Set())
  const [movingToCartItems, setMovingToCartItems] = React.useState<Set<number>>(new Set())
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  const wishlistItems = wishlistData?.wishlist || []
  const totalItems = wishlistItems.length

  // Handle remove wishlist item with loading state
  const handleRemoveItem = (productId: number) => {
    if (!customerId) return

    setRemovingItems((prev) => new Set(prev).add(productId))

    const payload = {
      user_id: customerId,
      product_id: productId
    }

    removeFromWishlist.mutate(payload, {
      onSettled: () => {
        setRemovingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      }
    })
  }

  // Handle move to cart from wishlist (add to cart + remove from wishlist)
  const handleMoveToCart = (item: WishlistItem) => {
    if (!customerId) return

    setMovingToCartItems((prev) => new Set(prev).add(item.id))

    const cartPayload = {
      id: item.id,
      quantity: 1,
      variation: []
    }

    const wishlistPayload = {
      user_id: customerId,
      product_id: item.id
    }

    // First add to cart
    addToCart(cartPayload, {
      onSuccess: () => {
        // Then remove from wishlist
        removeFromWishlist.mutate(wishlistPayload, {
          onSuccess: () => {
            setShowCartDrawer(true)
            // Refetch wishlist to update the UI
            refetch()
          },
          onSettled: () => {
            setMovingToCartItems((prev) => {
              const newSet = new Set(prev)
              newSet.delete(item.id)
              return newSet
            })
          }
        })
      },
      onError: () => {
        // If adding to cart fails, still remove from moving state
        setMovingToCartItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(item.id)
          return newSet
        })
      }
    })
  }

  // Handle move all to cart
  const handleMoveAllToCart = () => {
    if (!customerId) return

    // Create arrays to track all operations
    const itemsToMove = wishlistItems.filter((item) => !movingToCartItems.has(item.id))

    if (itemsToMove.length === 0) return

    // Add all items to moving state
    itemsToMove.forEach((item) => {
      setMovingToCartItems((prev) => new Set(prev).add(item.id))
    })

    // Process items sequentially to avoid overwhelming the API
    const processItemsSequentially = async (items: WishlistItem[]) => {
      for (const item of items) {
        await new Promise<void>((resolve) => {
          const cartPayload = {
            id: item.id,
            quantity: 1,
            variation: []
          }

          const wishlistPayload = {
            user_id: customerId,
            product_id: item.id
          }

          // Add to cart
          addToCart(cartPayload, {
            onSuccess: () => {
              // Then remove from wishlist
              removeFromWishlist.mutate(wishlistPayload, {
                onSuccess: () => {
                  // Remove from moving state after successful removal
                  setMovingToCartItems((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(item.id)
                    return newSet
                  })
                  resolve()
                },
                onError: () => {
                  // Still remove from moving state even if there's an error
                  setMovingToCartItems((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(item.id)
                    return newSet
                  })
                  resolve()
                }
              })
            },
            onError: () => {
              // Remove from moving state if cart add fails
              setMovingToCartItems((prev) => {
                const newSet = new Set(prev)
                newSet.delete(item.id)
                return newSet
              })
              resolve()
            }
          })
        })
      }

      // After all items are processed, open cart drawer and refetch wishlist
      setShowCartDrawer(true)
      refetch()
    }

    processItemsSequentially(itemsToMove)
  }

  // Calculate total price
  const totalPrice = wishlistItems.reduce((sum, item) => {
    return sum + parseFloat(item.price)
  }, 0)

  if (!isAuthenticated) {
    return (
      <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="flex flex-col gap-y-5 justify-center items-center w-full py-20">
          <Heart className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-center">Please login to view your wishlist</h2>
          <p className="text-gray-600 text-center">Sign in to see your saved items</p>
          <Button asChild size="lg" className="cursor-pointer">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading your wishlist...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pb-10 mx-auto px-4 py-14 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-gray-600 mt-2">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col gap-y-5 justify-center items-center w-full py-20">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="text-gray-600 text-center">
              Save items you love to your wishlist. Review them anytime and easily move them to your
              cart.
            </p>
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist Items Section */}
            <div className="flex-1">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold text-center">Price</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                    <TableHead className="font-semibold text-center">Remove</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {wishlistItems.map((item) => {
                    const isRemoving = removingItems.has(item.id)
                    const isMovingToCart = movingToCartItems.has(item.id)

                    return (
                      <TableRow
                        key={item.id}
                        className={isRemoving || isMovingToCart ? 'opacity-50 bg-slate-50' : ''}
                      >
                        {/* Product */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {(isRemoving || isMovingToCart) && (
                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded z-10">
                                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                </div>
                              )}
                              <Image
                                src={item.image || '/no-image.png'}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.id}`}
                                className={`font-medium hover:underline ${
                                  isRemoving || isMovingToCart ? 'pointer-events-none' : ''
                                }`}
                              >
                                <p className="line-clamp-2 text-sm lg:text-base">{item.name}</p>
                              </Link>
                            </div>
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="text-center font-semibold">
                          ₹{parseFloat(item.price).toLocaleString()}
                        </TableCell>

                        {/* Move to Cart Action */}
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleMoveToCart(item)}
                            disabled={isRemoving || isMovingToCart}
                          >
                            {isMovingToCart ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Moving...
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Move to Cart
                              </>
                            )}
                          </Button>
                        </TableCell>

                        {/* Remove */}
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving || isMovingToCart}
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

            {/* Wishlist Summary */}
            <div className="w-full lg:w-1/4">
              <div className="bg-slate-50 h-fit border border-slate-200 rounded-lg p-6 sticky top-4">
                <h2 className="mb-6 font-semibold text-xl">Wishlist Summary</h2>

                {/* Total Items */}
                <div className="flex p-4 border border-dotted border-slate-300 flex-row justify-between items-center mb-4">
                  <div>
                    <p className="opacity-80 font-semibold">Total Items</p>
                  </div>
                  <div>
                    <p className="opacity-80 font-semibold">{totalItems}</p>
                  </div>
                </div>

                {/* Total Value */}
                <div className="flex p-4 border border-dotted border-slate-300 flex-row justify-between items-center mb-4">
                  <div>
                    <p className="opacity-80 font-semibold">Total Value</p>
                  </div>
                  <div>
                    <p className="opacity-80 font-semibold">₹{totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Move All to Cart Button */}
                <div className="mb-4">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer"
                    disabled={
                      wishlistItems.length === 0 ||
                      removingItems.size > 0 ||
                      movingToCartItems.size > 0
                    }
                    onClick={handleMoveAllToCart}
                  >
                    {movingToCartItems.size > 0 ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Moving Items...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Move All to Cart
                      </>
                    )}
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

                {/* Info Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Items will be removed from wishlist when moved to cart
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCartDrawer && (
        <CartSidebar isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
      )}
    </div>
  )
}

export default Wishlist
