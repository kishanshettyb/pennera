// types for checkout requests

export type Address = {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

export type CheckoutCartData = {
  billing_address: Address
  shipping_address: Address
  customer_note?: string
  create_account?: boolean
  customer_password?: string
  payment_method: string
  payment_data?: { key: string; value: string }[]
  extensions?: Record<string, unknown>
}

export type CheckoutOrderPayload = {
  orderId: number
  data: unknown
}
