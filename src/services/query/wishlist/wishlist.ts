import { useQuery } from '@tanstack/react-query'
import { getAllWishlist } from '@/services/api/wishlist/wishlist'

export const useGetAllWishlist = (user_id: number) => {
  return useQuery({
    queryKey: ['wishlist', user_id],
    queryFn: () => getAllWishlist(user_id),
    enabled: !!user_id
  })
}
