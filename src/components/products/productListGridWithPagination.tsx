'use client'

import { useGetAllProductsPagination } from '@/services/query/products/product'
// import Sorting from './sorting'
import { Button } from '../ui/button'
import { Filter, Heart, ShoppingBag } from 'lucide-react'
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Counter } from '../ui/shadcn-io/counter'
import { useAddToCart } from '@/services/mutation/cart/cart'
import { useAddToWishlist, useRemoveFromWishlist } from '@/services/mutation/wishlist/wishlist'
import { useGetAllWishlist } from '@/services/query/wishlist/wishlist'
// import ShopFilters from './shop-filters'
import { CartSidebar } from '../cart-sidebar'
import { useCustomerContext } from '@/use-customer-context'
import ShopFilters from './shop-filters'
import Sorting from './sorting'
// import { useCustomerContext } from '../../../use-customer-context'

type ProductAttribute = {
  id: number
  name: string
  slug: string
  variation: boolean
  visible: boolean
  options: string[]
}

type Product = {
  id: number
  name: string
  regular_price: string
  sale_price: string
  slug: string
  price: string
  price_html: string
  images: { src: string }[]
  attributes: ProductAttribute[]
  variations: number[]
  default_attributes: Array<{ id: number; name: string; option: string }>
  stock_status: string
  categories: Array<{ id: number; name: string; slug: string }>
  tags: Array<{ id: number; name: string; slug: string }>
}

type WishlistItem = {
  id: number
  name: string
  price: string
  image: string
}

type SelectedVariation = { attribute: string; value: string }

export default function ProductsListGridWithPagination() {
  const fallbackImage = '/no-image.png'
  const [layout, setLayout] = useState(3)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showVariationModal, setShowVariationModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariations, setSelectedVariations] = useState<SelectedVariation[]>([])
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
  const { mutate: addToWishlist, isPending: isAddingToWishlist } = useAddToWishlist()
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } = useRemoveFromWishlist()
  const { customerId, isAuthenticated } = useCustomerContext()
  const observerRef = useRef<HTMLDivElement | null>(null)

  // Fetch wishlist data
  const { data: wishlistData } = useGetAllWishlist(customerId!)

  // Extract wishlist product IDs
  const wishlistProductIds = wishlistData?.wishlist?.map((item: WishlistItem) => item.id) || []

  // Check if a product is in wishlist
  const isProductInWishlist = (productId: number) => {
    return wishlistProductIds.includes(productId)
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1280) setLayout(4)
      else if (width >= 1024) setLayout(3)
      else if (width >= 640) setLayout(2)
      else setLayout(2)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const searchParams = useSearchParams()

  const buildQueryParams = () => {
    const params: Record<string, string | number> = {}
    const keys = [
      'search',
      'category',
      'size',
      'color',
      'availability',
      'min_price',
      'max_price',
      'orderby',
      'order',
      'page',
      'per_page'
    ]

    keys.forEach((key) => {
      const value = searchParams.get(key)
      if (value) params[key] = isNaN(Number(value)) ? value : Number(value)
    })

    return params
  }

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllProductsPagination(buildQueryParams())

  // Flatten paginated data
  const products: Product[] = data?.pages?.flat() ?? []

  // Infinite scroll effect
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleAddToCartClick = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)

    if (product.default_attributes?.length > 0) {
      setSelectedVariations(
        product.default_attributes.map((attr) => ({
          attribute: attr.name,
          value: attr.option
        }))
      )
    } else setSelectedVariations([])

    setShowVariationModal(true)
  }

  const handleVariationSelect = (attributeName: string, value: string) => {
    setSelectedVariations((prev) => {
      const existing = prev.find((v) => v.attribute === attributeName)
      if (existing) return prev.map((v) => (v.attribute === attributeName ? { ...v, value } : v))
      return [...prev, { attribute: attributeName, value }]
    })
  }

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return
    const payload = {
      id: selectedProduct.id,
      quantity,
      variation: selectedVariations
    }
    addToCart(payload, {
      onSuccess: () => {
        setShowVariationModal(false)
        setShowCartDrawer(true)
      }
    })
  }

  const handleCloseModal = () => {
    setShowVariationModal(false)
    setSelectedProduct(null)
    setSelectedVariations([])
    setQuantity(1)
  }

  // Wishlist handlers
  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || !customerId) {
      // Handle case where user is not logged in
      console.log('User not logged in - please login to add to wishlist')
      // You can add a login modal or redirect here
      return
    }

    const payload = {
      user_id: customerId,
      product_id: product.id
    }

    if (isProductInWishlist(product.id)) {
      // Product is in wishlist, so remove it
      removeFromWishlist(payload)
    } else {
      // Product is not in wishlist, so add it
      addToWishlist(payload)
    }
  }

  // Get active filter count for badge
  const getActiveFilterCount = () => {
    let count = 0
    if (searchParams.get('category')) count++
    if (searchParams.get('size')) count++
    if (searchParams.get('color')) count++
    if (searchParams.get('availability')) count++
    if (searchParams.get('min_price') || searchParams.get('max_price')) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  if (isLoading) {
    return (
      <div className="col-span-full grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-md p-4">
            <Skeleton className="h-[300px] w-full rounded-md mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <p>Failed to fetch products.</p>
  }

  if (!products?.length) {
    return (
      <div className="col-span-full flex flex-col justify-center items-center w-full py-10">
        <Image
          src="/no-data.jpg"
          alt="No Products Found"
          width={600}
          height={600}
          className="w-[600px] h-auto object-contain"
        />
        <h2 className="text-2xl font-semibold">No products found</h2>
        <p className="text-gray-600 mb-4">Try adjusting your filters</p>
        <Link href="/shop" className="bg-black text-white px-6 py-2 rounded-md">
          Clear Filters
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex border border-x-0 border-t-0 pb-4 justify-between items-center mb-10">
        <div className="lg:hidden">
          <Button onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
        <div className="flex gap-2 justify-start items-center flex-row">
          <div className="hidden lg:block text-sm">
            Showing <b>{products.length}</b> Products{' '}
            {activeFilterCount > 0 && (
              <span className="text-sm text-gray-600">
                ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied)
              </span>
            )}
          </div>
          <div
            onClick={() => setLayout(1)}
            className={clsx(
              'px-3 lg:hidden py-1 cursor-pointer text-sm font-semibold rounded border',
              layout === 1 ? 'bg-black text-white' : 'bg-white text-black'
            )}
          >
            |
          </div>
          <div
            onClick={() => setLayout(2)}
            className={clsx(
              'px-3 py-1 cursor-pointer text-sm font-semibold rounded border',
              layout === 2 ? 'bg-black text-white' : 'bg-white text-black'
            )}
          >
            ||
          </div>
          <div
            onClick={() => setLayout(3)}
            className={clsx(
              'px-3 hidden lg:block py-1 cursor-pointer text-sm font-semibold rounded border',
              layout === 3 ? 'bg-black text-white' : 'bg-white text-black'
            )}
          >
            |||
          </div>
          <div
            onClick={() => setLayout(4)}
            className={clsx(
              'px-3 hidden xl:block py-1 cursor-pointer text-sm font-semibold rounded border',
              layout === 4 ? 'bg-black text-white' : 'bg-white text-black'
            )}
          >
            ||||
          </div>
        </div>
        <div>
          <div className="flex gap-x-3 justify-start items-center">
            <div className="hidden lg:block text-sm">Sort by: </div>
            <Sorting />
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex">
          <div className="bg-white w-80 h-full overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="outline" onClick={() => setShowFilters(false)}>
                  Close
                </Button>
              </div>
            </div>
            <ShopFilters isMobile={true} onClose={() => setShowFilters(false)} />
          </div>
        </div>
      )}
      <div
        className={clsx(
          'grid gap-x-5 gap-y-8',
          layout === 1 && 'grid-cols-1',
          layout === 2 && 'grid-cols-2',
          layout === 3 && 'grid-cols-3',
          layout === 4 && 'grid-cols-4'
        )}
      >
        {products.map((product) => {
          const isInWishlist = isProductInWishlist(product.id)

          return (
            <div
              key={product.id}
              className="bg-white cursor-pointer border overflow-hidden hover:shadow-lg rounded-md group"
            >
              <div className="relative overflow-hidden">
                <Link href={`/product?slug=${product.slug}`}>
                  <Image
                    src={product.images?.[0]?.src || fallbackImage}
                    alt={product.name}
                    width={1000}
                    height={1000}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="absolute hidden group-hover:flex p-4 top-0 right-0">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={(e) => handleWishlistToggle(product, e)}
                    disabled={isAddingToWishlist || isRemovingFromWishlist || !isAuthenticated}
                    className={clsx(
                      'transition-colors duration-200',
                      isInWishlist
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Heart className={clsx(isInWishlist && 'fill-current')} size={20} />
                  </Button>
                </div>
                <div className="absolute w-full hidden group-hover:flex p-4 bottom-0 justify-between">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCartClick(product)
                    }}
                  >
                    <ShoppingBag />
                    Add to cart
                  </Button>
                </div>
              </div>
              <Link href={`/product?slug=${product.slug}`}>
                <div className="flex flex-col items-center my-5 px-2 lg:px-4 text-center">
                  <h2 className="text-lg line-clamp-2 font-semibold mb-2">{product.name}</h2>
                  <div className="flex gap-x-2">
                    {product.regular_price && (
                      <h2 className="text-gray-600 line-through opacity-60 text-lg font-light">
                        ₹{product.regular_price}
                      </h2>
                    )}
                    <h2 className="text-gray-600 text-lg font-semibold">₹{product.price}</h2>
                  </div>
                </div>
              </Link>
              <div className="p-4 lg:hidden flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className={clsx(
                    'flex-1 cursor-pointer transition-colors duration-200',
                    isInWishlist
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  )}
                  onClick={(e) => handleWishlistToggle(product, e)}
                  disabled={isAddingToWishlist || isRemovingFromWishlist || !isAuthenticated}
                >
                  <Heart className={clsx(isInWishlist && 'fill-current')} size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCartClick(product)
                  }}
                >
                  <ShoppingBag />
                  Add to cart
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Infinite scroll loader */}
      <div ref={observerRef} className="flex justify-center py-6">
        {isFetchingNextPage && <p>Loading more products...</p>}
      </div>

      {/* Variation Selection Modal */}
      {showVariationModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Select Options</h3>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <Image
                  src={selectedProduct.images[0]?.src}
                  alt={selectedProduct.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h4 className="text-lg font-semibold mt-2">{selectedProduct.name}</h4>
                <p className="text-gray-600 text-lg font-semibold">
                  {selectedProduct.price ? `₹${selectedProduct.price}` : 'Price unavailable'}
                </p>
              </div>

              {/* Variation Selection */}
              <div className="space-y-4 mb-6">
                {selectedProduct.attributes
                  ?.filter((attr) => attr.variation)
                  .map((attr) => {
                    const selectedValue = selectedVariations.find(
                      (v) => v.attribute === attr.name
                    )?.value

                    return (
                      <div key={attr.name}>
                        <p className="font-semibold capitalize mb-2">{attr.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {attr.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleVariationSelect(attr.name, opt)}
                              className={`px-3 py-2 rounded border text-sm ${
                                selectedValue === opt
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <p className="font-semibold mb-3">Quantity</p>
                <Counter number={quantity} setNumber={setQuantity} />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleConfirmAddToCart}
                  disabled={isAddingToCart || selectedProduct.stock_status !== 'instock'}
                >
                  <ShoppingBag />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCartDrawer && (
        <CartSidebar isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
      )}
    </>
  )
}
