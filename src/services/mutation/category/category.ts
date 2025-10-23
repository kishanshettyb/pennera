import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
    },

    onSettled: async (_, error) => {
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['category'] })
      }
    }
  })
}
