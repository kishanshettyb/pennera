// hooks/useCustomerData.ts
'use client'

import { useEffect, useRef } from 'react'
import { useGetCustomerByEmail } from '@/services/query/customers/customers'
import { useCustomerContext } from '../../../use-customer-context'

export function useCustomerData() {
  const { customer, updateCustomer, isAuthenticated } = useCustomerContext()
  const { data: customerData, isLoading, error } = useGetCustomerByEmail(customer?.user_email || '')

  // Use refs to track previous values and prevent unnecessary updates
  const previousCustomerId = useRef<number | undefined>(customer?.id)
  const hasUpdated = useRef(false)

  useEffect(() => {
    if (
      customerData &&
      customerData.length > 0 &&
      customer &&
      isAuthenticated &&
      !hasUpdated.current
    ) {
      const customerInfo = customerData[0]

      // Check if we actually need to update
      const needsUpdate =
        customerInfo.id !== customer.id ||
        !customer.id ||
        customerInfo.first_name !== customer.first_name ||
        customerInfo.last_name !== customer.last_name

      if (needsUpdate) {
        // Update context with customer ID and additional info
        updateCustomer({
          id: customerInfo.id,
          first_name: customerInfo.first_name,
          last_name: customerInfo.last_name
        })

        // Mark as updated to prevent further updates from this effect
        hasUpdated.current = true
        previousCustomerId.current = customerInfo.id
      }
    }
  }, [customerData, customer, isAuthenticated, updateCustomer])

  // Reset the update flag if customer changes
  useEffect(() => {
    if (!isAuthenticated) {
      hasUpdated.current = false
      previousCustomerId.current = undefined
    }
  }, [isAuthenticated])

  return {
    customerData,
    isLoading,
    error,
    isAuthenticated
  }
}
