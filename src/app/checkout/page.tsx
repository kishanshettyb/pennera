'use client'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/shadcn-io/counter'
import { useGetAllCart } from '@/services/query/cart/cart'
import { ArrowRight, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useUpdateCartItem, useRemoveFromCart } from '@/services/mutation/cart/cart'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm, useWatch } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { useGetCheckoutData } from '@/services/query/checkout/checkout'
import { useCheckoutCart, useCheckoutOrder } from '@/services/mutation/checkout/checkout'
import { useRouter } from 'next/navigation'
import { useGetAllPaymentGateways } from '@/services/query/payment-gateway/payment'
import { useGetAllCoupans } from '@/services/query/coupans/coupans'
import { useApplyCoupon, useRemoveCoupon } from '@/services/mutation/cart/cart'

// Razorpay types
declare global {
  interface Window {
    Razorpay: unknown
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string
  //eslint-disable-next-line no-unused-vars
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  notes: {
    address: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

// Types
type CartItem = {
  key: string
  name: string
  quantity: number
  permalink: string
  images?: { thumbnail?: string; alt?: string }[]
  prices?: { price?: string }
  totals?: { line_total?: string }
}

type AddressFormData = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  email: string
  phone: string
}

type PaymentGateway = {
  id: string
  title: string
  description: string | null
  order: string | number
  enabled: boolean
  method_title: string
  method_description: string
}

type Coupon = {
  id: number
  code: string
  amount: string
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product'
  description: string
  date_expires: string | null
  usage_count: number
  individual_use: boolean
  product_ids: number[]
  usage_limit: number | null
  free_shipping: boolean
  minimum_amount: string
  maximum_amount: string
}

type CheckoutFormData = {
  billing_address: AddressFormData
  shipping_address: Omit<AddressFormData, 'email'>
  customer_note: string
  create_account: boolean
  payment_method: string
  same_billing_shipping: boolean
  selected_coupon: string
}

type CheckoutResponse = {
  order_id: number
  order_key: string
  status: string
  razorpay_order_id?: string
}

// Pincode API response type
type PincodeData = {
  [key: string]: {
    district: string
    state: string
  }
}

// Memoized Address Form Component with pincode lookup
const AddressForm = React.memo(
  ({
    type,
    control,
    setValue,
    trigger
  }: {
    type: 'billing' | 'shipping'
    control: unknown
    setValue: unknown
    trigger: unknown
  }) => {
    const [isLoadingPincode, setIsLoadingPincode] = React.useState(false)

    // Function to fetch pincode data
    const fetchPincodeData = async (pincode: string): Promise<PincodeData | null> => {
      if (pincode.length !== 6) return null

      try {
        setIsLoadingPincode(true)
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const data = await response.json()

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
          return {
            [pincode]: {
              district: data[0].PostOffice[0].District,
              state: data[0].PostOffice[0].State
            }
          }
        }
        return null
      } catch (error) {
        console.error('Error fetching pincode data:', error)
        return null
      } finally {
        setIsLoadingPincode(false)
      }
    }

    // Handle pincode change
    const handlePincodeChange = async (pincode: string, addressType: 'billing' | 'shipping') => {
      // Update pincode field
      setValue(`${addressType}_address.postcode`, pincode)

      // If pincode is 6 digits, fetch location data
      if (pincode.length === 6 && /^\d+$/.test(pincode)) {
        const pincodeData = await fetchPincodeData(pincode)

        if (pincodeData) {
          const locationData = pincodeData[pincode]
          if (locationData) {
            // Auto-fill city and state
            setValue(`${addressType}_address.city`, locationData.district)
            setValue(`${addressType}_address.state`, locationData.state)

            // Trigger validation for the updated fields
            trigger(`${addressType}_address.city`)
            trigger(`${addressType}_address.state`)
          }
        }
      }
    }

    return (
      <div className="space-y-4 mt-10">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`${type}_address.first_name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} required />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${type}_address.last_name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} required />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {type === 'billing' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="billing_address.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} required />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="billing_address.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      value={field.value}
                      required
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length > 10) {
                          value = value.slice(0, 10)
                        }
                        field.onChange(value)
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        )}

        {type === 'shipping' && (
          <FormField
            control={control}
            name="shipping_address.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    value={field.value}
                    required
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length > 10) {
                        value = value.slice(0, 10)
                      }
                      field.onChange(value)
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name={`${type}_address.company`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${type}_address.address_1`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address Line 1 <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Street Address" {...field} required />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${type}_address.address_2`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Apartment, Suite, etc." {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={control}
            name={`${type}_address.city`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  City <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} required disabled={isLoadingPincode} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${type}_address.state`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  State <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} required disabled={isLoadingPincode} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${type}_address.postcode`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Postcode <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Postcode"
                      value={field.value}
                      required
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length > 6) {
                          value = value.slice(0, 6)
                        }
                        field.onChange(value)
                      }}
                      onBlur={async (e) => {
                        field.onBlur()
                        if (e.target.value.length === 6) {
                          await handlePincodeChange(e.target.value, type)
                        }
                      }}
                      ref={field.ref}
                      disabled={isLoadingPincode}
                    />
                    {isLoadingPincode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name={`${type}_address.country`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Country <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Country"
                  {...field}
                  required
                  value="IN"
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    )
  }
)

AddressForm.displayName = 'AddressForm'

function CheckoutPage() {
  const { data: cart, isLoading: cartLoading, refetch: refetchCart } = useGetAllCart()
  const { data: checkoutData, isLoading: checkoutLoading } = useGetCheckoutData()
  const { data: paymentGateways, isLoading: paymentGatewaysLoading } = useGetAllPaymentGateways()
  const { data: coupons } = useGetAllCoupans()
  const createCheckoutMutation = useCheckoutCart()
  const checkoutOrderMutation = useCheckoutOrder()
  const applyCouponMutation = useApplyCoupon()
  const removeCouponMutation = useRemoveCoupon()
  const router = useRouter()

  const [updatingItems, setUpdatingItems] = React.useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = React.useState<Set<string>>(new Set())
  const [isRazorpayLoading, setIsRazorpayLoading] = React.useState(false)
  const [, setCurrentOrderData] = React.useState<{
    orderData: CheckoutResponse
    formValues: CheckoutFormData
  } | null>(null)
  const [appliedCoupon, setAppliedCoupon] = React.useState<string>('')
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false)
  const [isRemovingCoupon, setIsRemovingCoupon] = React.useState(false)

  const updateCartItem = useUpdateCartItem()
  const removeCartItem = useRemoveFromCart()

  const enabledPaymentGateways = React.useMemo(() => {
    if (!paymentGateways) return []

    return paymentGateways
      .filter((gateway: PaymentGateway) => gateway.enabled)
      .sort((a: PaymentGateway, b: PaymentGateway) => {
        const orderA = typeof a.order === 'string' ? parseInt(a.order) || 0 : a.order
        const orderB = typeof b.order === 'string' ? parseInt(b.order) || 0 : b.order
        return orderA - orderB
      })
  }, [paymentGateways])

  const defaultPaymentMethod = enabledPaymentGateways.length > 0 ? enabledPaymentGateways[0].id : ''
  const isAnyActionPending = updatingItems.size > 0 || removingItems.size > 0

  // Calculate totals from cart data
  const totalItems = parseInt(cart?.totals?.total_items || '0')
  const totalDiscount = parseInt(cart?.totals?.total_discount || '0')
  const totalShipping = parseInt(cart?.totals?.total_shipping || '0')
  const totalPrice = parseInt(cart?.totals?.total_price || '0')
  const currencySymbol = cart?.totals?.currency_symbol || '₹'

  const form = useForm<CheckoutFormData>({
    defaultValues: {
      billing_address: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'IN',
        email: '',
        phone: ''
      },
      shipping_address: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'IN',
        phone: ''
      },
      customer_note: '',
      create_account: false,
      payment_method: defaultPaymentMethod,
      same_billing_shipping: true,
      selected_coupon: ''
    },
    mode: 'onChange'
  })

  // Get available coupons
  const availableCoupons = React.useMemo(() => {
    if (!coupons) return []
    return coupons.filter((coupon: Coupon) => {
      // Filter out expired coupons
      if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
        return false
      }
      // Check if coupon has usage limit and has reached it
      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return false
      }
      return true
    })
  }, [coupons])

  // Use useWatch with proper configuration to prevent excessive re-renders
  const sameBillingShipping = useWatch({
    control: form.control,
    name: 'same_billing_shipping',
    defaultValue: true
  })

  const billingAddress = useWatch({
    control: form.control,
    name: 'billing_address'
  })

  const paymentMethod = useWatch({
    control: form.control,
    name: 'payment_method',
    defaultValue: defaultPaymentMethod
  })

  // Handle coupon application with cart refetch
  const handleApplyCoupon = React.useCallback(
    async (couponCode: string) => {
      if (!couponCode) return

      setIsApplyingCoupon(true)
      try {
        const payload = { code: couponCode }
        await applyCouponMutation.mutateAsync(payload)
        setAppliedCoupon(couponCode)
        form.setValue('selected_coupon', couponCode)

        // Refetch cart to get updated totals with discount
        await refetchCart()
      } catch (error) {
        console.error('Failed to apply coupon:', error)
        // Error is handled in the mutation
      } finally {
        setIsApplyingCoupon(false)
      }
    },
    [applyCouponMutation, form, refetchCart]
  )

  // Handle coupon removal with cart refetch
  const handleRemoveCoupon = React.useCallback(async () => {
    if (!appliedCoupon) return

    setIsRemovingCoupon(true)
    try {
      const payload = { code: appliedCoupon }
      await removeCouponMutation.mutateAsync(payload)
      setAppliedCoupon('')
      form.setValue('selected_coupon', '')

      // Refetch cart to get updated totals without discount
      await refetchCart()
    } catch (error) {
      console.error('Failed to remove coupon:', error)
      // Error is handled in the mutation
    } finally {
      setIsRemovingCoupon(false)
    }
  }, [appliedCoupon, removeCouponMutation, form, refetchCart])

  // Set default payment method to first enabled gateway
  React.useEffect(() => {
    if (enabledPaymentGateways.length > 0 && !form.getValues('payment_method')) {
      form.setValue('payment_method', enabledPaymentGateways[0].id)
    }
  }, [enabledPaymentGateways, form])

  // Update form when checkout data is loaded - only once
  React.useEffect(() => {
    if (checkoutData && checkoutData.billing_address && !form.formState.isDirty) {
      const formData: CheckoutFormData = {
        billing_address: {
          first_name: checkoutData.billing_address?.first_name || '',
          last_name: checkoutData.billing_address?.last_name || '',
          company: checkoutData.billing_address?.company || '',
          address_1: checkoutData.billing_address?.address_1 || '',
          address_2: checkoutData.billing_address?.address_2 || '',
          city: checkoutData.billing_address?.city || '',
          state: checkoutData.billing_address?.state || '',
          postcode: checkoutData.billing_address?.postcode || '',
          country: checkoutData.billing_address?.country || 'IN',
          email: checkoutData.billing_address?.email || '',
          phone: checkoutData.billing_address?.phone || ''
        },
        shipping_address: {
          first_name: checkoutData.shipping_address?.first_name || '',
          last_name: checkoutData.shipping_address?.last_name || '',
          company: checkoutData.shipping_address?.company || '',
          address_1: checkoutData.shipping_address?.address_1 || '',
          address_2: checkoutData.shipping_address?.address_2 || '',
          city: checkoutData.shipping_address?.city || '',
          state: checkoutData.shipping_address?.state || '',
          postcode: checkoutData.shipping_address?.postcode || '',
          country: checkoutData.shipping_address?.country || 'IN',
          phone: checkoutData.shipping_address?.phone || ''
        },
        customer_note: checkoutData.customer_note || '',
        create_account: false,
        payment_method: checkoutData.payment_method || defaultPaymentMethod,
        same_billing_shipping: true,
        selected_coupon: ''
      }
      form.reset(formData)
    }
  }, [checkoutData, form, defaultPaymentMethod])

  // Handle same billing/shipping checkbox - optimized with debounce
  React.useEffect(() => {
    if (sameBillingShipping && billingAddress) {
      const { email, ...shippingAddress } = billingAddress
      // Only update if values are actually different to prevent infinite loops
      const currentShipping = form.getValues('shipping_address')

      if (JSON.stringify(currentShipping) !== JSON.stringify(shippingAddress)) {
        form.setValue('shipping_address', shippingAddress, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        })
      }
    }
  }, [sameBillingShipping, billingAddress, form])

  // Handle checkbox change explicitly
  const handleSameAddressChange = React.useCallback(
    (checked: boolean) => {
      form.setValue('same_billing_shipping', checked)
      if (checked && billingAddress) {
        const { email, ...shippingAddress } = billingAddress
        form.setValue('shipping_address', shippingAddress, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        })
      }
    },
    [form, billingAddress]
  )

  // Load Razorpay script dynamically
  const loadRazorpayScript = React.useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }, [])

  // Handle Razorpay payment after order is created
  const handleRazorpayPayment = React.useCallback(
    async (orderData: CheckoutResponse, formValues: CheckoutFormData) => {
      try {
        setIsRazorpayLoading(true)

        // Store both order data and form values for later use
        setCurrentOrderData({
          orderData,
          formValues
        })

        // Load Razorpay script
        const isScriptLoaded = await loadRazorpayScript()
        if (!isScriptLoaded) {
          throw new Error('Failed to load Razorpay SDK')
        }

        if (!window.Razorpay) {
          throw new Error('Razorpay not available')
        }

        // Use the final total (with discount applied) for payment amount
        const razorpayAmount = totalPrice // This is already in paise

        const razorpayOptions: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: razorpayAmount, // Amount in paise (with discount applied)
          currency: 'INR',
          name: 'Your Store Name',
          description: `Order #${orderData.order_id}`,
          order_id: orderData.razorpay_order_id, // Razorpay order ID from your backend
          handler: async (response: RazorpayResponse) => {
            console.log('Razorpay payment success:', response)

            // Prepare complete data for checkout order mutation to confirm payment
            const checkoutPayload = {
              billing_address: formValues.billing_address,
              shipping_address: formValues.shipping_address,
              customer_note: formValues.customer_note,
              create_account: formValues.create_account,
              payment_method: 'razorpay',
              payment_method_title: 'Razorpay',
              transaction_id: response.razorpay_payment_id,
              set_paid: true,
              // Razorpay specific data
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              // Don't include coupons in checkout payload since they're already applied to cart
              discount_total: (totalDiscount / 100).toString(),
              total: (totalPrice / 100).toString()
            }

            console.log('Sending complete checkout payload:', checkoutPayload)

            // Call checkout order mutation to confirm payment
            checkoutOrderMutation.mutate(
              { orderId: orderData.order_id, data: checkoutPayload },
              {
                onSuccess: (checkoutResponse) => {
                  console.log('Order confirmed:', checkoutResponse)

                  // CLEAR CART AFTER SUCCESSFUL PAYMENT
                  if (cart?.items) {
                    // Remove all items from cart one by one
                    const removePromises = cart.items.map(
                      (item: CartItem) =>
                        new Promise((resolve) => {
                          removeCartItem.mutate(item.key, {
                            onSettled: resolve
                          })
                        })
                    )

                    // Wait for all items to be removed
                    Promise.all(removePromises).then(() => {
                      console.log('Cart cleared successfully')

                      // Redirect to success page
                      setIsRazorpayLoading(false)
                      setCurrentOrderData(null)
                      router.push(`/checkout/order-received?orderId=${orderData.order_id}`)
                    })
                  } else {
                    // If no items in cart or cart is empty, just redirect
                    setIsRazorpayLoading(false)
                    setCurrentOrderData(null)
                    router.push(`/checkout/order-received?orderId=${orderData.order_id}`)
                  }
                },
                onError: (error) => {
                  console.error('Order confirmation failed:', error)
                  setIsRazorpayLoading(false)
                  // Handle error - show message to user
                  alert('Payment verification failed. Please contact support.')
                }
              }
            )
          },
          prefill: {
            name: `${formValues.billing_address.first_name} ${formValues.billing_address.last_name}`,
            email: formValues.billing_address.email,
            contact: formValues.billing_address.phone
          },
          notes: {
            address: `${formValues.billing_address.address_1}, ${formValues.billing_address.city}`
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed')
              setIsRazorpayLoading(false)
              setCurrentOrderData(null)
            }
          }
        }

        const razorpayInstance = new window.Razorpay(razorpayOptions)
        razorpayInstance.open()
      } catch (error) {
        console.error('Razorpay payment error:', error)
        setIsRazorpayLoading(false)
        setCurrentOrderData(null)
      }
    },
    [totalPrice, totalDiscount, checkoutOrderMutation, router, loadRazorpayScript, cart?.items]
  )

  // Submit handler - UPDATED to remove coupons from payload
  const onSubmit = React.useCallback(
    async (values: CheckoutFormData) => {
      console.log('Form submitted with values:', values)

      // Validate required fields
      if (
        !values.billing_address.first_name ||
        !values.billing_address.last_name ||
        !values.billing_address.email ||
        !values.billing_address.phone ||
        !values.billing_address.address_1 ||
        !values.billing_address.city ||
        !values.billing_address.state ||
        !values.billing_address.postcode
      ) {
        console.error('Required fields are missing')
        alert('Please fill all required fields')
        return
      }

      const payload = {
        billing_address: values.billing_address,
        shipping_address: values.shipping_address,
        customer_note: values.customer_note,
        create_account: values.create_account,
        payment_method: values.payment_method,
        payment_data: values.payment_method === 'razorpay' ? [{ method: 'razorpay' }] : [],
        // REMOVED coupons from payload since they're already applied to cart via separate API
        discount_total: (totalDiscount / 100).toString(),
        total: (totalPrice / 100).toString()
      }

      console.log('Sending checkout payload without coupons:', payload)
      console.log('Total items:', totalItems)
      console.log('Total discount:', totalDiscount)
      console.log('Total shipping:', totalShipping)
      console.log('Total price:', totalPrice)

      createCheckoutMutation.mutate(payload, {
        onSuccess: (data: CheckoutResponse) => {
          console.log('Checkout successful:', data)

          if (values.payment_method === 'razorpay' && data.status === 'pending') {
            // Handle Razorpay payment flow - order is created, now process payment
            handleRazorpayPayment(data, values)
          } else if (data.status === 'processing' || data.status === 'completed') {
            // Redirect to order complete page for successful orders
            console.log('Redirecting to order complete page with order ID:', data.order_id)
            router.push(`/checkout/order-received?orderId=${data.order_id}`)
          } else {
            // Fallback - redirect to order complete with available data
            console.log('No specific redirect, using fallback')
            router.push('/checkout/order-received')
          }
        },
        onError: (error) => {
          console.error('Checkout failed:', error)
          // You can add toast notifications here
          alert('Checkout failed. Please try again.')
        }
      })
    },
    [
      createCheckoutMutation,
      handleRazorpayPayment,
      router,
      totalDiscount,
      totalPrice,
      totalItems,
      totalShipping
    ]
  )

  const handleUpdateQuantity = React.useCallback(
    (itemKey: string, quantity: number) => {
      if (quantity < 1) return

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
    },
    [updateCartItem]
  )

  const handleRemoveItem = React.useCallback(
    (itemKey: string) => {
      setRemovingItems((prev) => new Set(prev).add(itemKey))
      removeCartItem.mutate(itemKey, {
        onSettled: () =>
          setRemovingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(itemKey)
            return newSet
          })
      })
    },
    [removeCartItem]
  )

  const isLoading = cartLoading || checkoutLoading || paymentGatewaysLoading
  const isProcessingPayment =
    createCheckoutMutation.isPending || isRazorpayLoading || checkoutOrderMutation.isPending

  return (
    <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-x-10 gap-y-5 w-full justify-between items-start flex-col lg:flex-row"
        >
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Billing Address */}
            <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
              <h2 className="text-xl font-semibold mb-5">Billing Details</h2>
              <AddressForm
                type="billing"
                control={form.control}
                setValue={form.setValue}
                trigger={form.trigger}
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
              <div className="flex flex-col items-start justify-start">
                <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={sameBillingShipping}
                    onCheckedChange={handleSameAddressChange}
                  />
                  <Label>Same as billing address</Label>
                </div>
              </div>
              {!sameBillingShipping && (
                <AddressForm
                  type="shipping"
                  control={form.control}
                  setValue={form.setValue}
                  trigger={form.trigger}
                />
              )}
            </div>

            {/* Customer Note */}
            <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
              <h2 className="text-xl font-semibold mb-5">Additional Information</h2>
              <FormField
                control={form.control}
                name="customer_note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                        placeholder="Notes about your order, e.g. special notes for delivery"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/4">
            <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Your Order</h2>
              <div className="p-4 bg-white rounded-2xl pb-0 space-y-4 max-h-[40vh] overflow-y-auto">
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
                        className={`flex gap-3 items-center last-of-type:border-b-0 border-b border-gray-200 pb-3 ${
                          isItemDisabled ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="w-16 h-16 relative">
                          {isItemDisabled && (
                            <div className="absolute inset-0  bg-white bg-opacity-70 flex items-center justify-center rounded z-10">
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
                              className={`font-medium text-xs line-clamp-1 hover:underline ${
                                isItemDisabled ? 'pointer-events-none' : ''
                              }`}
                            >
                              {item.name}
                            </Link>
                            {/* <p className="text-sm text-gray-500 mt-1">
                              {currencySymbol}
                              {(parseInt(item.prices?.price || '0') / 100).toLocaleString()}
                            </p> */}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Counter
                              className="text-xs"
                              number={item.quantity}
                              setNumber={(qty) => handleUpdateQuantity(item.key, qty)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleRemoveItem(item.key)}
                              disabled={isItemDisabled}
                            >
                              {isRemoving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 size="14" className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="font-semibold text-xs">
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

              {/* Order Summary */}
              <div className="space-y-2 mt-4">
                <div className="px-4 border-t border-slate-200 flex justify-between items-center py-2">
                  <div>
                    <h2 className="text-lg">Subtotal</h2>
                  </div>
                  <div>
                    <h2 className="text-lg">
                      {isAnyActionPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        `${currencySymbol}${(totalItems / 100).toLocaleString()}`
                      )}
                    </h2>
                  </div>
                </div>

                {/* Discount - FIXED DISPLAY */}
                {totalDiscount > 0 && (
                  <div className="px-4 py-2 flex justify-between items-center">
                    <div>
                      <h2 className="text-xs text-green-600">Discount</h2>
                    </div>
                    <div className="text-xs text-green-600">
                      -{currencySymbol}
                      {(totalDiscount / 100).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="px-4 py-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-xs">Shipping charges</h2>
                  </div>
                  <div className="text-xs">
                    {totalShipping > 0
                      ? `${currencySymbol}${(totalShipping / 100).toLocaleString()}`
                      : 'FREE'}
                  </div>
                </div>

                {/* Coupon Selection */}
                <div className="px-4 border bg-slate-100 rounded-xl">
                  <Accordion type="single" collapsible className="w-full cursor-pointer">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs cursor-pointer">
                        {appliedCoupon ? `Applied: ${appliedCoupon}` : 'Apply Coupon'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        {appliedCoupon ? (
                          <div className="space-y-3">
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-xs text-green-700">
                                {appliedCoupon} applied successfully!
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              disabled={isRemovingCoupon}
                              className="w-full"
                            >
                              {isRemovingCoupon ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                  Removing...
                                </>
                              ) : (
                                'Remove Coupon'
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                              {availableCoupons.map((coupon: Coupon) => (
                                <Button
                                  key={coupon.id}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApplyCoupon(coupon.code)}
                                  disabled={isApplyingCoupon}
                                  className="justify-start text-left h-auto py-2"
                                >
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{coupon.code}</span>
                                    <span className="text-xs text-gray-500">
                                      {coupon.discount_type === 'percent'
                                        ? `${coupon.amount}% off`
                                        : `${currencySymbol}${coupon.amount} off`}
                                    </span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                            {isApplyingCoupon && (
                              <div className="flex justify-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="px-4 border-t border-slate-200 flex justify-between items-center py-2">
                  <div>
                    <h2 className="text-xl font-semibold">Total</h2>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {isAnyActionPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        `${currencySymbol}${(totalPrice / 100).toLocaleString()}`
                      )}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-slate-200 w-full p-6 text-slate-800">
                <h2 className="text-md font-semibold mb-2">Payment Info</h2>
                {paymentGatewaysLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Loading payment methods...</span>
                  </div>
                ) : enabledPaymentGateways.length > 0 ? (
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-3 cursor-pointer"
                          >
                            {enabledPaymentGateways.map((gateway: PaymentGateway) => (
                              <div key={gateway.id} className="flex items-center gap-3">
                                <RadioGroupItem value={gateway.id} id={`payment-${gateway.id}`} />
                                <Label
                                  htmlFor={`payment-${gateway.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {gateway.title}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="text-center py-4 text-sm text-red-500">
                    No payment methods available. Please contact support.
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <div className="px-0 py-2">
                <Button
                  type="submit"
                  className="w-full text-lg py-6 lg:py-6 cursor-pointer"
                  size="lg"
                  disabled={
                    isProcessingPayment ||
                    !cart?.items?.length ||
                    enabledPaymentGateways.length === 0
                  }
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight />
                    </>
                  )}
                </Button>
                {createCheckoutMutation.isError && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Checkout failed. Please try again.
                  </p>
                )}
                {enabledPaymentGateways.length === 0 && !paymentGatewaysLoading && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    No payment methods available
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CheckoutPage
