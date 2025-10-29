'use client'

import { createCustomer, loginCustomer, updateCustomer } from '@/services/api/customers/customers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useMergeCart } from '../cart/cart'
import { useCustomerContext } from '@/use-customer-context'

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: FormData) => createCustomer(payload),

    onError: (error) => {
      let apiMessage = 'Something went wrong. Please try again.'

      if (error instanceof AxiosError) {
        apiMessage = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        apiMessage = error.message
      }

      toast.error('Failed to create customer', {
        description: apiMessage
      })
    },

    onSuccess: () => {
      router.push('/auth')
      router.refresh()
      toast.success('Customer created successfully!', {
        description: 'The new customer has been added to the system.'
      })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['customers'] })
      }
    }
  })
}

export function useLoginCustomer() {
  const { login } = useCustomerContext()
  const { mutate: mergeCart } = useMergeCart()

  return useMutation({
    mutationFn: (payload: { username: string; password: string }) => loginCustomer(payload),

    onError: (error) => {
      let apiMessage = 'Something went wrong. Please try again.'

      if (error instanceof AxiosError) {
        apiMessage = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        apiMessage = error.message
      }

      toast.error('Login failed', { description: apiMessage })
    },

    onSuccess: async (data) => {
      const customerData = {
        user_email: data.user_email,
        user_nicename: data.user_nicename,
        user_display_name: data.user_display_name,
        token: data.token
      }

      login(customerData)
      window.location.replace('/')
      mergeCart()
      toast.success('Login successful!', {
        description: `Welcome ${data.user_nicename}!`
      })
    }
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: unknown }) =>
      updateCustomer(customerId, data),

    onError: (error) => {
      let apiMessage = 'Something went wrong. Please try again.'

      if (error instanceof AxiosError) {
        apiMessage = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        apiMessage = error.message
      }

      toast.error('Failed to update customer', {
        description: apiMessage
      })
    },

    onSuccess: () => {
      toast.success('Customer updated successfully!', {
        description: 'The customer details have been saved.'
      })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['customers'] })
      }
    }
  })
}
