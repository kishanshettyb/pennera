'use client'
import React, { useState, useEffect } from 'react'
import { Loader2, Mail, Phone, MapPin, User, Edit, Save, X, ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetCustomerById } from '@/services/query/customers/customers'
import { useUpdateCustomer } from '@/services/mutation/customers/customers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { useCustomerContext } from '@/use-customer-context'

const addressSchema = z.object({
  billing: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address_1: z.string().min(1, 'Address is required'),
    address_2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
    email: z.string().email('Invalid billing email'),
    phone: z.string().min(1, 'Phone is required')
  }),
  shipping: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address_1: z.string().min(1, 'Address is required'),
    address_2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Phone is required')
  })
})

type Address = {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
  email?: string
  phone?: string
}

type AddressFormData = z.infer<typeof addressSchema>

// Helper function to check if address fields are empty
const isAddressEmpty = (address?: Address) => {
  if (!address) return true
  return (
    !address.first_name &&
    !address.last_name &&
    !address.address_1 &&
    !address.city &&
    !address.state &&
    !address.postcode &&
    !address.country
  )
}

function AddressPage() {
  const { customerId } = useCustomerContext()
  const { data: customer, isLoading, error, refetch } = useGetCustomerById(customerId!)
  const updateCustomerMutation = useUpdateCustomer()

  const [isEditing, setIsEditing] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [hasNoAddress, setHasNoAddress] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      billing: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        email: '',
        phone: ''
      },
      shipping: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        phone: ''
      }
    }
  })

  // Watch billing address fields to copy to shipping
  const billingAddress = watch('billing')

  // Reset form with customer data when it loads and check if addresses are empty
  useEffect(() => {
    if (customer) {
      const isBillingEmpty = isAddressEmpty(customer.billing)
      const isShippingEmpty = isAddressEmpty(customer.shipping)

      setHasNoAddress(isBillingEmpty && isShippingEmpty)

      reset({
        billing: {
          first_name: customer.billing.first_name || '',
          last_name: customer.billing.last_name || '',
          company: customer.billing.company || '',
          address_1: customer.billing.address_1 || '',
          address_2: customer.billing.address_2 || '',
          city: customer.billing.city || '',
          state: customer.billing.state || '',
          postcode: customer.billing.postcode || '',
          country: customer.billing.country || '',
          email: customer.billing.email || customer.email || '',
          phone: customer.billing.phone || ''
        },
        shipping: {
          first_name: customer.shipping.first_name || '',
          last_name: customer.shipping.last_name || '',
          company: customer.shipping.company || '',
          address_1: customer.shipping.address_1 || '',
          address_2: customer.shipping.address_2 || '',
          city: customer.shipping.city || '',
          state: customer.shipping.state || '',
          postcode: customer.shipping.postcode || '',
          country: customer.shipping.country || '',
          phone: customer.shipping.phone || ''
        }
      })

      // Set sameAsBilling based on initial data if addresses exist
      if (!isBillingEmpty && !isShippingEmpty) {
        const isSameAddress =
          customer.billing.address_1 === customer.shipping.address_1 &&
          customer.billing.city === customer.shipping.city &&
          customer.billing.postcode === customer.shipping.postcode

        setSameAsBilling(isSameAddress)
      }
    }
  }, [customer, reset])

  // Sync shipping address with billing when sameAsBilling is true
  useEffect(() => {
    if (sameAsBilling && isEditing) {
      setValue('shipping.first_name', billingAddress.first_name)
      setValue('shipping.last_name', billingAddress.last_name)
      setValue('shipping.company', billingAddress.company)
      setValue('shipping.address_1', billingAddress.address_1)
      setValue('shipping.address_2', billingAddress.address_2)
      setValue('shipping.city', billingAddress.city)
      setValue('shipping.state', billingAddress.state)
      setValue('shipping.postcode', billingAddress.postcode)
      setValue('shipping.country', billingAddress.country)
      setValue('shipping.phone', billingAddress.phone)
    }
  }, [billingAddress, sameAsBilling, isEditing, setValue])

  const onSubmit = async (data: AddressFormData) => {
    try {
      await updateCustomerMutation.mutateAsync({
        customerId,
        data: {
          billing: data.billing,
          shipping: sameAsBilling ? data.billing : data.shipping
        }
      })

      setIsEditing(false)
      setHasNoAddress(false)
      toast.success('Addresses updated successfully!')
      refetch()
    } catch (error) {
      toast.error('Failed to update addresses' + error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
    // If canceling from "add address" mode and no addresses exist, stay in editing mode
    if (hasNoAddress) {
      setIsEditing(true)
    }
  }

  const handleAddAddress = () => {
    setIsEditing(true)
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading addresses...</span>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Addresses</h1>
          <p className="text-gray-600">
            Unable to load customer addresses. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  // Render empty state when no addresses exist and not in editing mode
  if (hasNoAddress && !isEditing) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manage Addresses</h1>
            <p className="text-slate-600">Update your billing and shipping addresses</p>
          </div>
        </div>

        {/* Empty State */}
        <Card className="bg-slate-50 border-slate-200 text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="rounded-full bg-slate-100 p-4">
              <MapPin className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Addresses Added</h3>
              <p className="text-slate-600 max-w-md">
                You have not added any addresses yet. Add your billing and shipping addresses to
                make checkout faster.
              </p>
            </div>
            <Button onClick={handleAddAddress} className="flex items-center gap-2" size="lg">
              <Plus className="h-5 w-5" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Addresses</h1>
          <p className="text-slate-600">Update your billing and shipping addresses</p>
        </div>
      </div>

      <div className="flex gap-x-10 gap-y-5 w-full justify-between items-start flex-col lg:flex-row">
        {/* Left Column - Billing Address */}
        <div className="w-full lg:w-1/2 space-y-6">
          <Card className="bg-slate-50 border-slate-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-800">
                Billing Address
              </CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {hasNoAddress ? 'Add Addresses' : 'Edit Addresses'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  {isEditing ? (
                    <div className="flex gap-2 flex-1">
                      <div className="flex-1">
                        <Input
                          {...register('billing.first_name')}
                          placeholder="First Name"
                          className={errors.billing?.first_name ? 'border-red-500' : ''}
                        />
                        {errors.billing?.first_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing.first_name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          {...register('billing.last_name')}
                          placeholder="Last Name"
                          className={errors.billing?.last_name ? 'border-red-500' : ''}
                        />
                        {errors.billing?.last_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="font-medium">
                      {customer.billing.first_name || 'Not provided'} {customer.billing.last_name}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                  {isEditing ? (
                    <div className="space-y-3 flex-1">
                      <div>
                        <Input
                          {...register('billing.address_1')}
                          placeholder="Address Line 1"
                          className={errors.billing?.address_1 ? 'border-red-500' : ''}
                        />
                        {errors.billing?.address_1 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing.address_1.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('billing.address_2')}
                          placeholder="Address Line 2 (Optional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            {...register('billing.city')}
                            placeholder="City"
                            className={errors.billing?.city ? 'border-red-500' : ''}
                          />
                          {errors.billing?.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.billing.city.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register('billing.state')}
                            placeholder="State"
                            className={errors.billing?.state ? 'border-red-500' : ''}
                          />
                          {errors.billing?.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.billing.state.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            {...register('billing.postcode')}
                            placeholder="Postcode"
                            className={errors.billing?.postcode ? 'border-red-500' : ''}
                          />
                          {errors.billing?.postcode && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.billing.postcode.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register('billing.country')}
                            placeholder="Country"
                            className={errors.billing?.country ? 'border-red-500' : ''}
                          />
                          {errors.billing?.country && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.billing.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : hasNoAddress ? (
                    <p className="text-slate-500 italic">No billing address added yet</p>
                  ) : (
                    <div className="space-y-1">
                      <p>{customer.billing.address_1 || 'Not provided'}</p>
                      {customer.billing.address_2 && <p>{customer.billing.address_2}</p>}
                      <p>
                        {customer.billing.city}, {customer.billing.state}{' '}
                        {customer.billing.postcode}
                      </p>
                      <p>{customer.billing.country}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Input
                          {...register('billing.email')}
                          type="email"
                          className={errors.billing?.email ? 'border-red-500' : ''}
                        />
                        {errors.billing?.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing.email.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm">{customer.billing.email || 'Not provided'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Input
                          {...register('billing.phone')}
                          className={errors.billing?.phone ? 'border-red-500' : ''}
                        />
                        {errors.billing?.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing.phone.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm">{customer.billing.phone || 'Not provided'}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Shipping Address */}
        <div className="w-full lg:w-1/2 space-y-6">
          <Card className="bg-slate-50 border-slate-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Shipping Address
              </CardTitle>
              {isEditing && (
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                  />
                  <Label htmlFor="sameAsBilling" className="text-sm font-medium">
                    Same as billing address
                  </Label>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  {isEditing && !sameAsBilling ? (
                    <div className="flex gap-2 flex-1">
                      <div className="flex-1">
                        <Input
                          {...register('shipping.first_name')}
                          placeholder="First Name"
                          className={errors.shipping?.first_name ? 'border-red-500' : ''}
                        />
                        {errors.shipping?.first_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.shipping.first_name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          {...register('shipping.last_name')}
                          placeholder="Last Name"
                          className={errors.shipping?.last_name ? 'border-red-500' : ''}
                        />
                        {errors.shipping?.last_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.shipping.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="font-medium">
                      {customer.shipping.first_name || 'Not provided'} {customer.shipping.last_name}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                  {isEditing && !sameAsBilling ? (
                    <div className="space-y-3 flex-1">
                      <div>
                        <Input
                          {...register('shipping.address_1')}
                          placeholder="Address Line 1"
                          className={errors.shipping?.address_1 ? 'border-red-500' : ''}
                        />
                        {errors.shipping?.address_1 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.shipping.address_1.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('shipping.address_2')}
                          placeholder="Address Line 2 (Optional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            {...register('shipping.city')}
                            placeholder="City"
                            className={errors.shipping?.city ? 'border-red-500' : ''}
                          />
                          {errors.shipping?.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.shipping.city.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register('shipping.state')}
                            placeholder="State"
                            className={errors.shipping?.state ? 'border-red-500' : ''}
                          />
                          {errors.shipping?.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.shipping.state.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            {...register('shipping.postcode')}
                            placeholder="Postcode"
                            className={errors.shipping?.postcode ? 'border-red-500' : ''}
                          />
                          {errors.shipping?.postcode && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.shipping.postcode.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            {...register('shipping.country')}
                            placeholder="Country"
                            className={errors.shipping?.country ? 'border-red-500' : ''}
                          />
                          {errors.shipping?.country && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.shipping.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : hasNoAddress ? (
                    <p className="text-slate-500 italic">No shipping address added yet</p>
                  ) : (
                    <div className="space-y-1">
                      <p>{customer.shipping.address_1 || 'Not provided'}</p>
                      {customer.shipping.address_2 && <p>{customer.shipping.address_2}</p>}
                      <p>
                        {customer.shipping.city}, {customer.shipping.state}{' '}
                        {customer.shipping.postcode}
                      </p>
                      <p>{customer.shipping.country}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {isEditing && !sameAsBilling ? (
                    <div className="flex-1">
                      <Input
                        {...register('shipping.phone')}
                        className={errors.shipping?.phone ? 'border-red-500' : ''}
                      />
                      {errors.shipping?.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.shipping.phone.message}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm">{customer.shipping.phone || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <Card className="bg-slate-50 border-slate-50">
              <CardContent className="p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateCustomerMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateCustomerMutation.isPending || !isDirty}
                    className="flex items-center gap-2"
                  >
                    {updateCustomerMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {updateCustomerMutation.isPending
                      ? 'Saving...'
                      : hasNoAddress
                        ? 'Add Addresses'
                        : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressPage
