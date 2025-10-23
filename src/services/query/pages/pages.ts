import { getPagesDetails } from '@/services/api/pages/pages'
import { useQuery } from '@tanstack/react-query'

export function useGetPageDetails(slug: string) {
  return useQuery({
    queryKey: ['pages', slug],
    queryFn: () => getPagesDetails(slug),
    staleTime: 1000 * 60 * 5 // cache for 5 mins
  })
}
