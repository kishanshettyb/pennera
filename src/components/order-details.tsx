'use client'

import React from 'react'
import { Box, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useGetOrderByOrderId } from '@/services/query/orders/orders'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderDetailsFallback() {
  return (
    <div className="w-full md:w-full lg:w-2/3 flex mx-auto flex-col">
      <div className="bg-slate-50 p-6 border border-slate-100 rounded-2xl flex justify-start max-w-fit items-center gap-x-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    </div>
  )
}

function OrderDetailsContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const { data: order, isLoading, error } = useGetOrderByOrderId(orderId)

  if (isLoading) {
    return <OrderDetailsFallback />
  }

  if (error || !order) {
    return (
      <div className="w-full md:w-full lg:w-2/3 flex mx-auto flex-col">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Order Not Found</h2>
          <p className="text-gray-600">Sorry, we could not find your order details.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
      processing: { text: 'Processing', color: 'text-blue-600' },
      completed: { text: 'Completed', color: 'text-green-600' },
      pending: { text: 'Pending', color: 'text-yellow-600' },
      cancelled: { text: 'Cancelled', color: 'text-red-600' },
      failed: { text: 'Failed', color: 'text-red-600' }
    }
    return statusMap[status] || { text: status, color: 'text-gray-600' }
  }

  const statusInfo = getStatusDisplay(order.status)

  // Calculate subtotal from line items
  const calculateSubtotal = () => {
    return order.line_items.reduce((total, item) => total + parseFloat(item.total), 0)
  }

  const subtotal = calculateSubtotal()
  const shippingTotal = parseFloat(order.shipping_total)
  const orderTotal = parseFloat(order.total)

  return (
    <div className="w-full  ">
      {/* Order Header */}
      <div className="bg-slate-50 p-6 border border-slate-100 rounded-2xl flex justify-start max-w-fit items-center gap-x-5">
        <h2 className="text-2xl flex justify-start items-center gap-x-2 font-semibold">
          <Box size="26" />
          Order #{order.number}
        </h2>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-10 p-6 border border-slate-100 shadow-2xl shadow-slate-100 lg:grid-cols-5 rounded-xl">
        <div className="text-center border border-slate-100 p-2 rounded-xl bg-slate-50">
          <h2 className="font-semibold text-sm opacity-60">Order No.</h2>
          <p className="text-lg font-semibold">{order.number}</p>
        </div>
        <div className="text-center border border-slate-100 p-2 rounded-xl bg-slate-50">
          <h2 className="font-semibold text-sm opacity-60">Order Status</h2>
          <p className={`text-lg font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
        </div>
        <div className="text-center border border-slate-100 p-2 rounded-xl bg-slate-50">
          <h2 className="font-semibold text-sm opacity-60">Date</h2>
          <p className="text-lg font-semibold">{formatDate(order.date_created)}</p>
        </div>
        <div className="text-center border border-slate-100 p-2 rounded-xl bg-slate-50">
          <h2 className="font-semibold text-sm opacity-60">Total</h2>
          <p className="text-lg font-semibold">
            {order.currency_symbol}
            {orderTotal.toLocaleString()}
          </p>
        </div>
        <div className="text-center col-span-2 md:col-span-1 border border-slate-100 p-2 rounded-xl bg-slate-50">
          <h2 className="font-semibold text-sm opacity-60">Payment Method</h2>
          <p className="text-xs font-semibold">{order.payment_method_title}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="my-10 border border-slate-100 shadow-2xl shadow-slate-100 rounded-xl">
        <h2 className="font-semibold text-center text-lg my-2">Your Order</h2>
        <hr />
        <div className="p-6">
          <h2 className="text-lg my-2 font-semibold">Product</h2>

          <div className="border border-slate-100 rounded-xl w-full">
            {/* Order Items */}
            {order.line_items.map((item, index) => (
              <div
                key={item.id}
                className={`flex p-4 flex-row justify-between items-center ${
                  index < order.line_items.length - 1
                    ? 'border-x-0 border border-t-0 border-b-slate-200'
                    : ''
                }`}
              >
                <div className="flex justify-start items-center gap-5">
                  <div>
                    {item.image?.src ? (
                      <Image
                        alt={item.name}
                        src={item.image.src}
                        width="500"
                        height="500"
                        className="w-[100px] h-[80px] rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-[100px] h-[80px] bg-gray-200 rounded-md flex items-center justify-center">
                        <Box className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{item.name}</h2>
                    <ul>
                      <li className="text-xs">
                        <span className="font-semibold">Qty:</span> {item.quantity}
                      </li>
                      {item.meta_data &&
                        item.meta_data.map(
                          (meta, metaIndex) =>
                            meta.key !== '_reduced_stock' && (
                              <li key={metaIndex} className="text-xs">
                                <span className="font-semibold capitalize">
                                  {meta.display_key || meta.key}:
                                </span>{' '}
                                {meta.display_value || meta.value}
                              </li>
                            )
                        )}
                      {item.sku && (
                        <li className="text-xs">
                          <span className="font-semibold">SKU:</span> {item.sku}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="font-semibold">
                  {order.currency_symbol}
                  {parseFloat(item.total).toLocaleString()}
                </div>
              </div>
            ))}

            {/* Order Totals */}
            <div className="flex p-4 flex-row justify-between items-center border-x-0 border border-t-0 border-b-slate-200">
              <div>
                <h2 className="text-md my-2 font-semibold">Subtotal:</h2>
              </div>
              <div>
                {order.currency_symbol}
                {subtotal.toLocaleString()}
              </div>
            </div>
            <div className="flex p-4 flex-row justify-between items-center border-x-0 border border-t-0 border-b-slate-200">
              <div>
                <h2 className="text-md my-2 font-semibold">Shipping:</h2>
              </div>
              <div>
                {shippingTotal === 0
                  ? 'Free'
                  : `${order.currency_symbol}${shippingTotal.toLocaleString()}`}
              </div>
            </div>
            <div className="flex p-4 flex-row justify-between items-center border-x-0">
              <div>
                <h2 className="text-lg my-2 font-semibold">Total:</h2>
              </div>
              <div className="text-lg font-semibold">
                {order.currency_symbol}
                {orderTotal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border rounded-xl my-5">
            <div className="flex flex-col lg:flex-row justify-between gap-x-5 items-start p-6">
              <div className="flex-1 mb-6 lg:mb-0">
                <h2 className="text-lg my-2 font-semibold">Billing Address:</h2>
                <div className="text-sm space-y-1">
                  <div className="font-medium">
                    {order.billing.first_name} {order.billing.last_name}
                  </div>
                  {order.billing.company && <div>{order.billing.company}</div>}
                  <div>{order.billing.address_1}</div>
                  {order.billing.address_2 && <div>{order.billing.address_2}</div>}
                  <div>
                    {order.billing.city}, {order.billing.state} {order.billing.postcode}
                  </div>
                  <div>{order.billing.country}</div>
                  <div>{order.billing.email}</div>
                  {order.billing.phone && <div>{order.billing.phone}</div>}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg my-2 font-semibold">Shipping Address:</h2>
                <div className="text-sm space-y-1">
                  <div className="font-medium">
                    {order.shipping.first_name} {order.shipping.last_name}
                  </div>
                  {order.shipping.company && <div>{order.shipping.company}</div>}
                  <div>{order.shipping.address_1}</div>
                  {order.shipping.address_2 && <div>{order.shipping.address_2}</div>}
                  <div>
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
                  </div>
                  <div>{order.shipping.country}</div>
                  {order.shipping.phone && <div>{order.shipping.phone}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Note */}
          {order.customer_note && (
            <div className="border rounded-xl my-5 p-6 bg-slate-50">
              <h2 className="text-lg my-2 font-semibold">Customer Note:</h2>
              <p className="text-sm text-gray-600">{order.customer_note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main exported component with Suspense boundary
function OrderDetails() {
  return (
    <Suspense fallback={<OrderDetailsFallback />}>
      <OrderDetailsContent />
    </Suspense>
  )
}

export default OrderDetails
