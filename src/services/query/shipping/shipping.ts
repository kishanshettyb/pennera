import { useQuery } from '@tanstack/react-query'
import {
  getAllShippingClasses,
  getAllTaxes,
  getAllShippingMethod
} from '@/services/api/shipping/shipping'

export function useGetAllShippingClasses() {
  return useQuery({
    queryKey: ['shippingClasses'],
    queryFn: () => getAllShippingClasses(),
    staleTime: 1000 * 60 * 5
  })
}

export function useGetAllTaxes() {
  return useQuery({
    queryKey: ['taxes'],
    queryFn: () => getAllTaxes(),
    staleTime: 1000 * 60 * 5
  })
}

export function useGetAllShippingMethods() {
  return useQuery({
    queryKey: ['shippingMethods'],
    queryFn: () => getAllShippingMethod(),
    staleTime: 1000 * 60 * 5
  })
}
