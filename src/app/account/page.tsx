'use client'
import React, { useState, useEffect } from 'react'
import { Loader2, Mail, Calendar, User, Edit, Save, X, Shield } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useGetCustomerById } from '@/services/query/customers/customers'
import { useUpdateCustomer } from '@/services/mutation/customers/customers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useCustomerContext } from '@/use-customer-context'

// Validation schema for basic customer profile
const customerProfileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required')
})

type CustomerProfileFormData = z.infer<typeof customerProfileSchema>

function AccountPage() {
  const { customerId } = useCustomerContext()
  const { data: customer, isLoading, error, refetch } = useGetCustomerById(customerId)
  const updateCustomerMutation = useUpdateCustomer()

  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<CustomerProfileFormData>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: ''
    }
  })

  // Reset form with customer data when it loads
  useEffect(() => {
    if (customer) {
      reset({
        username: customer.username,
        email: customer.email,
        first_name: customer.billing.first_name || '',
        last_name: customer.billing.last_name || ''
      })
    }
  }, [customer, reset])

  const onSubmit = async (data: CustomerProfileFormData) => {
    try {
      await updateCustomerMutation.mutateAsync({
        customerId,
        data: {
          username: data.username,
          email: data.email,
          billing: {
            ...customer.billing,
            first_name: data.first_name,
            last_name: data.last_name
          },
          shipping: {
            ...customer.shipping,
            first_name: data.first_name,
            last_name: data.last_name
          }
        }
      })

      setIsEditing(false)
      toast.success('Profile updated successfully!')
      refetch()
    } catch (error) {
      toast.error('Failed to update profile' + error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
        <div className="w-full mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <span className="text-lg text-slate-700 font-medium">Loading your profile...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
        <div className="w-full mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              We could not load your profile information. Please try refreshing the page or contact
              support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="w-full mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
              <p className="text-slate-600">Manage your account information and preferences</p>
            </div>
            <Button
              variant={isEditing ? 'outline' : 'default'}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-6"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Main Profile Section */}
          <div className="flex-1 space-y-6">
            {/* Profile Overview Card */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-xl overflow-hidden">
                        <Image
                          src={customer.avatar_url}
                          alt={`${customer.username}'s avatar`}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <Badge
                      className={`mt-4 px-4 py-1.5 text-sm font-medium ${
                        customer.is_paying_customer
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0'
                          : 'bg-slate-200 text-slate-700 border-0'
                      }`}
                    >
                      {customer.is_paying_customer ? 'Premium Member' : 'Standard Member'}
                    </Badge>
                  </div>

                  {/* Profile Information */}
                  <div className="flex-1 space-y-6">
                    {/* Name Section */}
                    <div>
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              First Name
                            </label>
                            <Input
                              {...register('first_name')}
                              placeholder="First Name"
                              className={`h-12 ${errors.first_name ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.first_name && (
                              <p className="text-red-500 text-xs mt-2">
                                {errors.first_name.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Last Name
                            </label>
                            <Input
                              {...register('last_name')}
                              placeholder="Last Name"
                              className={`h-12 ${errors.last_name ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.last_name && (
                              <p className="text-red-500 text-xs mt-2">
                                {errors.last_name.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                          {customer.billing.first_name && customer.billing.last_name
                            ? `${customer.billing.first_name} ${customer.billing.last_name}`
                            : customer.username}
                        </h1>
                      )}
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 capitalize text-sm"
                        >
                          {customer.role}
                        </Badge>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-slate-500 text-sm">
                          Member since {new Date(customer.date_created).getFullYear()}
                        </span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </label>
                        {isEditing ? (
                          <div>
                            <Input
                              {...register('email')}
                              type="email"
                              className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.email && (
                              <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-900 font-medium">{customer.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Username
                        </label>
                        {isEditing ? (
                          <div>
                            <Input
                              {...register('username')}
                              className={`h-11 ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.username && (
                              <p className="text-red-500 text-xs mt-2">{errors.username.message}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-900 font-medium">@{customer.username}</p>
                        )}
                      </div>
                    </div>

                    {/* Account Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Account Created
                        </label>
                        <p className="text-slate-600">{formatDate(customer.date_created)}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last Updated
                        </label>
                        <p className="text-slate-600">{formatDate(customer.date_modified)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes Card */}
            {isEditing && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">Save your changes</h3>
                      <p className="text-sm text-slate-600">
                        Review and save your updated profile information
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateCustomerMutation.isPending}
                        className="min-w-24"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={updateCustomerMutation.isPending || !isDirty}
                        className="min-w-32 bg-blue-600 hover:bg-blue-700"
                      >
                        {updateCustomerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Account Details */}
          <div className="lg:w-96 space-y-6">
            {/* Account Status Card */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Membership</span>
                  <Badge
                    className={`capitalize font-medium ${
                      customer.is_paying_customer
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0'
                        : 'bg-slate-200 text-slate-700 border-0'
                    }`}
                  >
                    {customer.is_paying_customer ? 'Premium' : 'Standard'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Account Type</span>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
                    {customer.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700 font-medium">Member Since</span>
                  <span className="text-slate-900 font-medium">
                    {new Date(customer.date_created).getFullYear()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {customer.meta_data && customer.meta_data.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {customer.meta_data.slice(0, 6).map((meta, index) => (
                      <div key={meta.id} className="group">
                        <div className="flex flex-col p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="font-medium text-slate-800 text-sm capitalize mb-1">
                            {meta.key.replace(/_/g, ' ').replace(/-/g, ' ')}
                          </div>
                          <div className="text-slate-500 text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                            {typeof meta.value === 'object'
                              ? JSON.stringify(meta.value)
                              : meta.value.toString()}
                          </div>
                        </div>
                        {index < customer.meta_data.length - 1 && index < 5 && (
                          <Separator className="opacity-50" />
                        )}
                      </div>
                    ))}
                    {customer.meta_data.length > 6 && (
                      <div className="text-center text-sm text-slate-500 pt-2">
                        +{customer.meta_data.length - 6} more items
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
