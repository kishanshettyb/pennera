'use client'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/shadcn-io/counter'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetAllProducts } from '@/services/query/products/product'
import { Heart, MessageCircleMore, ShoppingBag, ShoppingCart, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAddToCart } from '@/services/mutation/cart/cart'
import FeaturesBar from '../features-bar'
import { ProductGallery } from './product-gallery'
import { CartSidebar } from '../cart-sidebar'
import { Product } from '@/types/productTypes'
import PopularProducts from '../popular-products'

type SelectedVariation = {
  attribute: string
  value: string
}

function ProductDetails() {
  const searchParams = useSearchParams()
  const filters = {
    slug: searchParams.get('slug') || undefined
  }
  const { data, isLoading, isError } = useGetAllProducts(filters)

  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()

  const products = React.useMemo(() => (data ?? []) as Product[], [data])

  const [quantity, setQuantity] = useState(1)

  // State for selected variations
  const [selectedVariations, setSelectedVariations] = useState<SelectedVariation[]>([])

  // Initialize selected variations with default attributes when product loads
  React.useEffect(() => {
    if (products.length > 0) {
      const product = products[0]
      const defaultVariations = product.default_attributes.map((attr) => ({
        attribute: attr.name,
        value: attr.option
      }))
      setSelectedVariations(defaultVariations)
    }
  }, [products])

  const handleVariationSelect = (attributeName: string, value: string) => {
    setSelectedVariations((prev) => {
      const existing = prev.find((v) => v.attribute === attributeName)
      if (existing) {
        return prev.map((v) => (v.attribute === attributeName ? { ...v, value } : v))
      }
      return [...prev, { attribute: attributeName, value }]
    })
  }

  const handleAddToCart = () => {
    if (products.length === 0) return

    const product = products[0]

    // For variable products, we need to find the specific variation ID
    // Since your API might handle variation matching, we can send the attributes
    const payload = {
      id: product.id,
      quantity: quantity,
      variation: selectedVariations
    }

    addToCart(payload, {
      onSuccess: () => {
        setShowCartDrawer(true) // open drawer automatically
      }
    })
  }

  const handleBookNow = () => {
    // Similar to add to cart but might redirect to checkout
    handleAddToCart()
    // Add redirect logic here if needed
  }

  if (isLoading) {
    return (
      <div className="col-span-full grid grid-cols-3 gap-4">
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
      </div>
    )
  }

  const product = products[0]

  return (
    <>
      <section className="py-10 lg:py-20 border border-x-0 border-slate-100 border-b-0">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <div
            key={product.id}
            className="flex w-full flex-col lg:flex-row gap-x-4 lg:gap-x-30 justify-center items-center"
          >
            <div className="w-full lg:w-1/3">
              <ProductGallery images={product.images} />
            </div>
            <div className="w-full lg:w-1/3">
              <h2 className="text-xl lg:text-2xl font-semibold mb-2">{product.name}</h2>
              <div className="flex my-3 flex-row gap-y-2 lg:gap-y-0 justify-between items-center">
                <div>
                  <div className="flex flex-row justify-center items-center gap-1">
                    <Star size="18" className="text-orange-400" />
                    <Star size="18" className="text-orange-400" />
                    <Star size="18" className="text-orange-400" />
                    <Star size="18" className="text-orange-400" />
                    <Star size="18" className="text-orange-400" />
                    <div className="lg:text-md text-xs uppercase pl-2">
                      {product.rating_count} Reviews
                    </div>
                  </div>
                </div>
                {product.sku ?? (
                  <div>
                    <div className="lg:text-md text-xs ml-2">
                      <span className="font-semibold">SKU:</span>
                      {product.sku}
                    </div>
                  </div>
                )}

                <div>
                  {product.stock_status == 'instock' ? (
                    <div className="text-xs lg:text-md text-green-600 px-1 lg:px-3 py-1 border border-green-200 bg-green-100 rounded">
                      In Stock
                    </div>
                  ) : (
                    <div className="text-xs lg:text-md text-red-600 px-1 lg:px-3 py-1 border border-red-200 bg-red-100 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl lg:text-2xl font-semibold mb-2">₹ {product.price}</h2>
              </div>
              <div
                className="text-md opacity-80 line-clamp-2 mt-5"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />

              {/* Variation Selection */}
              <div className="mt-4 space-y-3">
                {product.attributes
                  .filter((attr) => attr.variation)
                  .map((attr) => {
                    const selectedValue = selectedVariations.find(
                      (v) => v.attribute === attr.name
                    )?.value

                    return (
                      <div key={attr.name}>
                        <p className="font-semibold capitalize text-sm">{attr.name}</p>
                        <div className="flex gap-2 mt-1">
                          {attr.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleVariationSelect(attr.name, opt)}
                              className={`px-3 py-1 rounded border ${
                                selectedValue === opt
                                  ? 'bg-slate-900 text-white border-slate-900'
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
              <div className="flex justify-between gap-x-5 items-center">
                {/* Quantity Selection */}
                <div className="flex flex-col my-4 items-start">
                  <p className="font-semibold mb-2 text-sm">Quantity</p>
                  <Counter number={quantity} setNumber={setQuantity} />
                </div>
                <div className="w-full lg:w-[70%]">
                  <p className="font-semibold mb-2">&nbsp;</p>
                  <Button
                    variant="outline"
                    className="w-full text-lg py-5 cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock_status !== 'instock'}
                  >
                    <ShoppingCart />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>
                <div>
                  <p className="font-semibold mb-2">&nbsp;</p>
                  <Button
                    variant="outline"
                    className="w-full text-lg py-5 px-10 cursor-pointer"
                    disabled={isAddingToCart || product.stock_status !== 'instock'}
                  >
                    <Heart />
                    {isAddingToCart ? 'Adding...' : ''}
                  </Button>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="gap-5 flex flex-row">
                <div className="w-full">
                  <Button
                    variant="default"
                    className="w-full text-lg py-5"
                    onClick={handleBookNow}
                    disabled={isAddingToCart || product.stock_status !== 'instock'}
                  >
                    <ShoppingBag />
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Payment Gateway */}
              <div className="bg-[#f7f7f7] px-8 py-6 my-4">
                <p className="font-semibold mb-2">Guarantee safe and secure checkout</p>
                <Image
                  alt="Payment Gateway"
                  src="/payment-getway.avif"
                  width={500}
                  height={400}
                  className="w-auto h-auto object-contain"
                />
              </div>

              {/* Features */}
              <div className="bg-[#fcf3e6] flex justify-center gap-x-10 items-center px-10 py-4">
                <div className="flex justify-start gap-5">
                  <Truck /> Free Shipping Option
                </div>
                <div className="flex justify-start gap-5">
                  <MessageCircleMore />
                  Reliable support
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="flex justify-center my-20">
            <Tabs defaultValue="details" className="w-full bg-transparent">
              <div className="flex flex-col lg:flex-row justify-center overflow-scroll">
                <TabsList className="py-5 flex flex-row gap-5 rounded-md">
                  <TabsTrigger className="text-lg text-slate-600 rounded-md p-4" value="details">
                    Product Details
                  </TabsTrigger>
                  <TabsTrigger className="text-lg text-slate-600 rounded-md p-4" value="additional">
                    Additional Information
                  </TabsTrigger>
                  <TabsTrigger className="text-lg text-slate-600 rounded-md p-4" value="shipping">
                    Shipping & Return
                  </TabsTrigger>
                  <TabsTrigger className="text-lg text-slate-600 rounded-md p-4" value="reviews">
                    Product Reviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="p-6 border rounded-xl   product-description">
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description || 'No description available'
                  }}
                />
              </TabsContent>

              <TabsContent
                value="additional"
                className="p-6 border rounded-xl shadow-2xl shadow-slate-100"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">SKU</h3>
                    <p>{product.sku}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Availability</h3>
                    <p>{product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Attributes</h3>
                    {product.attributes.map((attr) => (
                      <div key={attr.id} className="mt-2">
                        <p className="font-medium capitalize">{attr.name}:</p>
                        <p>{attr.options.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="shipping"
                className="p-6 border rounded-xl shadow-2xl shadow-slate-100"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Shipping Information</h3>
                  <p>
                    Free shipping on orders over ₹5000. Standard delivery takes 3-5 business days.
                  </p>
                  <h3 className="font-semibold text-lg">Return Policy</h3>
                  <p>
                    30-day return policy. Items must be in original condition with tags attached.
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="reviews"
                className="p-6 border rounded-xl shadow-2xl shadow-slate-100"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size="20" className="text-orange-400" />
                      ))}
                    </div>
                    <span className="font-semibold">Based on {product.rating_count} reviews</span>
                  </div>
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <section className="border pt-10 mt-10 bg-[linear-gradient(to_right,#f8fafc,#f9fafb,#fafafa,#fafaf9)]">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <PopularProducts />
        </div>
      </section>

      <section className="py-5 bg-[linear-gradient(to_right,#fdf2f8,#eef2ff,#eff6ff,#ecfdf5)]">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <FeaturesBar />
        </div>
      </section>
      {showCartDrawer && (
        <CartSidebar isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
      )}
    </>
  )
}

export default ProductDetails
