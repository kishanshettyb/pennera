'use client'
import React from 'react'
import { useGetAllOrders } from '@/services/query/orders/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Package, ShoppingCart, Eye, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCheckoutOrder } from '@/services/mutation/checkout/checkout'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { useCustomerContext } from '@/use-customer-context'

// Types based on the API response
type OrderItem = {
  id: number
  name: string
  product_id: number
  variation_id: number
  quantity: number
  subtotal: string
  total: string
  price: number
  sku: string
  image: {
    id: string | number
    src: string
  }
  meta_data: Array<{
    id: number
    key: string
    value: string
    display_key?: string
    display_value?: string
  }>
}

type Order = {
  id: number
  number: string
  status: string
  date_created: string
  total: string
  currency_symbol: string
  payment_method: string
  payment_method_title: string
  billing: {
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
    email: string
    phone: string
  }
  shipping: {
    first_name: string
    last_name: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
    phone: string
  }
  line_items: OrderItem[]
  payment_url: string
  needs_payment: boolean
  needs_processing: boolean
  key?: string
}

// Main OrdersPage Component
function OrdersPage() {
  const { customerId } = useCustomerContext()
  const { data: orders, isLoading, error } = useGetAllOrders(customerId!)
  const checkoutMutation = useCheckoutOrder()

  const handleCompleteOrder = (order: Order) => {
    const paymentMethod = order.payment_method || 'cheque'

    const payload = {
      key: order.key || `wc_order_${order.id}`,
      billing_email: order.billing.email,
      billing_address: {
        first_name: order.billing.first_name,
        last_name: order.billing.last_name,
        company: '',
        address_1: order.billing.address_1,
        address_2: order.billing.address_2 || '',
        city: order.billing.city,
        state: order.billing.state,
        postcode: order.billing.postcode,
        country: order.billing.country,
        email: order.billing.email,
        phone: order.billing.phone
      },
      shipping_address: {
        first_name: order.shipping.first_name,
        last_name: order.shipping.last_name,
        company: '',
        address_1: order.shipping.address_1,
        address_2: order.shipping.address_2 || '',
        city: order.shipping.city,
        state: order.shipping.state,
        postcode: order.shipping.postcode,
        country: order.shipping.country,
        phone: order.shipping.phone
      },
      payment_method: paymentMethod,
      payment_data: []
    }

    checkoutMutation.mutate({
      orderId: order.id,
      data: payload
    })
  }

  // Columns Definition
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'number',
      header: 'Order #',
      cell: ({ row }) => {
        const order = row.original
        return <div className="font-medium">#{order.number}</div>
      }
    },
    {
      accessorKey: 'date_created',
      header: 'Date',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="text-sm">
            {new Date(order.date_created).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )
      }
    },
    {
      accessorKey: 'line_items',
      header: 'Items',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {order.line_items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100"
                >
                  <Image
                    src={item.image?.src || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ))}
              {order.line_items.length > 3 && (
                <div className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium">
                  +{order.line_items.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="font-medium">
            {order.currency_symbol}
            {parseFloat(order.total).toLocaleString()}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const order = row.original
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'completed':
              return 'bg-green-100 text-green-800'
            case 'processing':
              return 'bg-blue-100 text-blue-800'
            case 'pending':
              return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
              return 'bg-red-100 text-red-800'
            case 'refunded':
              return 'bg-gray-100 text-gray-800'
            default:
              return 'bg-gray-100 text-gray-800'
          }
        }

        return (
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'payment_method_title',
      header: 'Payment Method',
      cell: ({ row }) => {
        const order = row.original
        const getPaymentMethodDisplay = (order: Order) => {
          if (order.payment_method_title) {
            return order.payment_method_title
          }

          switch (order.payment_method) {
            case 'razorpay':
              return 'Credit/Debit Card'
            case 'cod':
              return 'Cash on Delivery'
            case 'bacs':
              return 'Bank Transfer'
            case 'cheque':
              return 'Check'
            case 'paypal':
              return 'PayPal'
            default:
              return order.payment_method || 'Unknown'
          }
        }

        return <div className="text-sm text-gray-600">{getPaymentMethodDisplay(order)}</div>
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const order = row.original
        const isCompletingOrder = checkoutMutation.isPending

        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`orders/order-details?orderId=${order.id}`}>
                <Eye className="h-4 w-4" /> View
              </Link>
            </Button>
            {order.needs_payment && (
              <Button
                size="sm"
                onClick={() => handleCompleteOrder(order)}
                disabled={isCompletingOrder}
              >
                {isCompletingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  if (isLoading) {
    return (
      <div className=" w-full bg-gray-50 py-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading your orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 py-8">
        <Card className="w-full mx-auto">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load orders</h3>
            <p className="text-gray-600 mb-4">
              There was an error loading your orders. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className=" w-full bg-gray-50 py-8">
        <div className=" w-full mx-auto px-4">
          <Card className=" mx-auto">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className=" w-full bg-gray-50 py-8">
      <div className="w-full mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your orders</p>
        </div>

        {/* Orders Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((order: Order) => order.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((order: Order) => order.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((order: Order) => order.status === 'processing').length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={orders as Order[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrdersPage
