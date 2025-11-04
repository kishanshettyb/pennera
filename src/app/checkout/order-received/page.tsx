// app/checkout/order-received/[orderId]/page.tsx
'use client'

import { useGetOrderByOrderId } from '@/services/query/orders/orders'
import { Loader2, CheckCircle, Truck, Package } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { Suspense } from 'react'

function OrderReceivedFallback() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    </div>
  )
}

function OrderReceivedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const { data: order, isLoading, error } = useGetOrderByOrderId(orderId)

  if (isLoading) {
    return <OrderReceivedFallback />
  }

  if (error || !order) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
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
      processing: { text: 'PROCESSING', color: 'text-blue-600' },
      completed: { text: 'COMPLETED', color: 'text-green-600' },
      pending: { text: 'PENDING', color: 'text-yellow-600' },
      cancelled: { text: 'CANCELLED', color: 'text-red-600' },
      failed: { text: 'FAILED', color: 'text-red-600' }
    }
    return statusMap[status] || { text: status.toUpperCase(), color: 'text-gray-600' }
  }

  // Calculate subtotal from line items
  const calculateSubtotal = () => {
    return order.line_items.reduce((total, item) => {
      return total + parseFloat(item.subtotal)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const discountTotal = parseFloat(order.discount_total)
  const shippingTotal = parseFloat(order.shipping_total)
  const total = parseFloat(order.total)

  const statusInfo = getStatusDisplay(order.status)

  return (
    <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank you. Your order has been received.
        </h1>
        <p className="text-gray-600 text-lg">
          Order #{order.number} • {formatDate(order.date_created)}
        </p>
      </div>

      <div className="flex gap-x-10 gap-y-5 w-full justify-between items-start flex-col lg:flex-row">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Order Status Card */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${statusInfo.color}`}>{statusInfo.text}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-2xl font-bold text-gray-900">
                  {order.currency_symbol}
                  {total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
            <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Order Placed</div>
                  <div className="text-sm text-gray-500">{formatDate(order.date_created)}</div>
                </div>
              </div>

              {order.date_paid && (
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Payment Received</div>
                    <div className="text-sm text-gray-500">{formatDate(order.date_paid)}</div>
                  </div>
                </div>
              )}

              {order.date_completed && (
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Order Completed</div>
                    <div className="text-sm text-gray-500">{formatDate(order.date_completed)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            <div className="space-y-4">
              {order.line_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.quantity} × {item.name}
                    </div>
                    {item.meta_data &&
                      item.meta_data.map(
                        (meta, index) =>
                          meta.key !== '_reduced_stock' && (
                            <div key={index} className="text-sm text-gray-500 mt-1">
                              {meta.display_key || meta.key}: {meta.display_value || meta.value}
                            </div>
                          )
                      )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {order.currency_symbol}
                      {parseFloat(item.total).toLocaleString()}
                    </div>
                    {parseFloat(item.subtotal) !== parseFloat(item.total) && (
                      <div className="text-sm text-gray-500 line-through">
                        {order.currency_symbol}
                        {parseFloat(item.subtotal).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {order.currency_symbol}
                  {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Coupon Discount */}
              {discountTotal > 0 && order.coupon_lines && order.coupon_lines.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Discount {order.coupon_lines.map((coupon) => `(${coupon.code})`).join(', ')}:
                  </span>
                  <span className="font-medium text-green-600">
                    -{order.currency_symbol}
                    {discountTotal.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {shippingTotal === 0
                    ? 'Free shipping'
                    : `${order.currency_symbol}${shippingTotal.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment method:</span>
                <span className="font-medium">{order.payment_method_title}</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                <span>Total:</span>
                <span>
                  {order.currency_symbol}
                  {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon Details */}
            {order.coupon_lines && order.coupon_lines.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Coupon Applied</h3>
                {order.coupon_lines.map((coupon, index) => (
                  <div key={index} className="text-sm text-green-700">
                    <div className="flex justify-between">
                      <span>Coupon code: {coupon.code}</span>
                      <span>
                        Discount: -{order.currency_symbol}
                        {parseFloat(coupon.discount).toLocaleString()}
                      </span>
                    </div>
                    {coupon.discount_type === 'percent' && coupon.nominal_amount && (
                      <div className="text-xs text-green-600 mt-1">
                        {coupon.nominal_amount}% off applied
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Note */}
          {order.customer_note && (
            <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
              <h3 className="text-lg font-semibold mb-4">Customer Note</h3>
              <p className="text-gray-600 bg-white p-4 rounded-lg border">{order.customer_note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Order Summary */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">{order.number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">{formatDate(order.date_created)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold">{order.payment_method_title}</span>
              </div>
              {order.coupon_lines && order.coupon_lines.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Coupon Applied:</span>
                  <span className="font-semibold text-green-600">
                    {order.coupon_lines.map((coupon) => coupon.code).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Paid:</span>
                <span>
                  {order.currency_symbol}
                  {total.toLocaleString()}
                </span>
              </div>
              {discountTotal > 0 && (
                <div className="text-sm text-green-600 text-right mt-1">
                  You saved {order.currency_symbol}
                  {discountTotal.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
            <h2 className="text-xl font-semibold mb-4">Address Information</h2>

            {/* Billing Address */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Billing Address
              </h3>
              <div className="text-gray-600 text-sm space-y-1 bg-white p-3 rounded-lg border">
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
                <div>{order.billing.phone}</div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping Address
              </h3>
              <div className="text-gray-600 text-sm space-y-1 bg-white p-3 rounded-lg border">
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

          {/* Actions */}
          <div className="bg-slate-50 w-full p-6 text-slate-800 rounded-lg border border-slate-50">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your order, please contact our customer support team.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main exported component with Suspense boundary
export default function OrderReceivedPage() {
  return (
    <Suspense fallback={<OrderReceivedFallback />}>
      <OrderReceivedContent />
    </Suspense>
  )
}
