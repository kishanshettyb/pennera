'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface Customer {
  id?: number
  user_email: string
  user_nicename: string
  user_display_name: string
  token?: string
  first_name?: string
  last_name?: string
  billing?: {
    first_name: string
    last_name: string
  }
  shipping?: {
    first_name: string
    last_name: string
  }
}

interface CustomerContextType {
  customer: Customer | null
  //eslint-disable-next-line no-unused-vars
  login: (customerData: Customer) => void
  logout: () => void
  isAuthenticated: boolean
  //eslint-disable-next-line no-unused-vars
  updateCustomer: (customerData: Partial<Customer>) => void
  customerId?: number
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

interface CustomerProviderProps {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)

  // Helper function to get stored customer data
  const getStoredCustomerData = () => {
    try {
      const token = Cookies.get('jwt_token')
      const session = localStorage.getItem('session')

      if (token && session === 'true') {
        return {
          id: localStorage.getItem('customer_id')
            ? parseInt(localStorage.getItem('customer_id')!)
            : undefined,
          user_email: localStorage.getItem('user_email') || '',
          user_nicename: localStorage.getItem('user_nicename') || '',
          user_display_name: localStorage.getItem('user_display_name') || '',
          first_name: localStorage.getItem('first_name') || undefined,
          last_name: localStorage.getItem('last_name') || undefined,
          token: token
        }
      }
    } catch (error) {
      console.error('Error reading from storage:', error)
    }
    return null
  }

  // Initialize customer from cookies/localStorage on mount
  useEffect(() => {
    const storedCustomer = getStoredCustomerData()
    if (storedCustomer) {
      setCustomer(storedCustomer)
    }
  }, [])

  const login = (customerData: Customer) => {
    setCustomer(customerData)

    // Store token in cookies (expires in 7 days)
    if (customerData.token) {
      Cookies.set('jwt_token', customerData.token, { expires: 7, secure: true, sameSite: 'strict' })
    }

    // Store session info
    localStorage.setItem('session', 'true')
    localStorage.setItem('user_email', customerData.user_email)
    localStorage.setItem('user_nicename', customerData.user_nicename)
    localStorage.setItem('user_display_name', customerData.user_display_name)

    if (customerData.id) localStorage.setItem('customer_id', customerData.id.toString())
    if (customerData.first_name) localStorage.setItem('first_name', customerData.first_name)
    if (customerData.last_name) localStorage.setItem('last_name', customerData.last_name)
  }

  const updateCustomer = (customerData: Partial<Customer>) => {
    setCustomer((prev) => {
      if (!prev) return null
      const updatedCustomer = { ...prev, ...customerData }

      if (customerData.token) {
        Cookies.set('jwt_token', customerData.token, {
          expires: 7,
          secure: true,
          sameSite: 'strict'
        })
      }
      if (customerData.id) localStorage.setItem('customer_id', customerData.id.toString())
      if (customerData.first_name) localStorage.setItem('first_name', customerData.first_name)
      if (customerData.last_name) localStorage.setItem('last_name', customerData.last_name)

      return updatedCustomer
    })
  }

  const logout = () => {
    setCustomer(null)

    // Remove token from cookies
    Cookies.remove('jwt_token')
    Cookies.remove('wc_nonce')

    // Clear localStorage
    localStorage.removeItem('session')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_nicename')
    localStorage.removeItem('user_display_name')
    localStorage.removeItem('customer_id')
    localStorage.removeItem('first_name')
    localStorage.removeItem('last_name')
  }

  const value = {
    customer,
    login,
    logout,
    updateCustomer,
    isAuthenticated: !!customer,
    customerId: customer?.id
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export function useCustomerContext() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomerContext must be used within a CustomerProvider')
  return context
}
