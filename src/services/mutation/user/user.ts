'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { changeCustomerPassword } from '@/services/api/user/user'

export function useChangeCustomerPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { customerId: number; newPassword: string }) =>
      changeCustomerPassword(payload.customerId, payload.newPassword),

    onError: (error) => {
      let apiMessage = 'Something went wrong. Please try again.'

      if (error instanceof AxiosError) {
        apiMessage = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        apiMessage = error.message
      }

      toast.error('Password change failed', {
        description: apiMessage
      })
    },

    onSuccess: (_, variables) => {
      toast.success('Password updated successfully!', {
        description: `Password for customer ID ${variables.customerId} has been changed.`
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
