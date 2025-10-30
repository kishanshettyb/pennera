'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const SORT_OPTIONS = [
  {
    label: 'Default',
    value: 'menu_order',
    order: 'asc',
    apiValue: { orderby: 'menu_order', order: 'asc' }
  },
  {
    label: 'Price: High to Low',
    value: 'price-desc',
    order: 'desc',
    apiValue: { orderby: 'price', order: 'desc' }
  },
  {
    label: 'Price: Low to High',
    value: 'price-asc',
    order: 'asc',
    apiValue: { orderby: 'price', order: 'asc' }
  },
  {
    label: 'Popularity',
    value: 'popularity',
    order: 'desc',
    apiValue: { orderby: 'popularity', order: 'desc' }
  },
  {
    label: 'Newest',
    value: 'date',
    order: 'desc',
    apiValue: { orderby: 'date', order: 'desc' }
  },
  {
    label: 'Name: A to Z',
    value: 'title-asc',
    order: 'asc',
    apiValue: { orderby: 'title', order: 'asc' }
  },
  {
    label: 'Name: Z to A',
    value: 'title-desc',
    order: 'desc',
    apiValue: { orderby: 'title', order: 'desc' }
  },
  {
    label: 'Rating',
    value: 'rating',
    order: 'desc',
    apiValue: { orderby: 'rating', order: 'desc' }
  }
]

function Sorting() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current sort values from URL
  const currentOrderBy = searchParams.get('orderby') || 'menu_order'
  const currentOrder = searchParams.get('order') || 'asc'

  // Find the current sort option
  const getCurrentSortValue = () => {
    // Special case for default sorting
    if (!currentOrderBy || (currentOrderBy === 'menu_order' && currentOrder === 'asc')) {
      return 'menu_order'
    }

    // Find matching option
    const currentOption = SORT_OPTIONS.find(
      (option) =>
        option.apiValue.orderby === currentOrderBy && option.apiValue.order === currentOrder
    )

    return currentOption?.value || 'menu_order'
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Find the selected sort option
    const selectedOption = SORT_OPTIONS.find((option) => option.value === value)

    if (selectedOption) {
      // For default sorting, remove the params
      if (value === 'menu_order') {
        params.delete('orderby')
        params.delete('order')
      } else {
        // Set the sorting parameters
        params.set('orderby', selectedOption.apiValue.orderby)
        params.set('order', selectedOption.apiValue.order)
      }

      // Remove page parameter when changing sort
      params.delete('page')

      // Update URL
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }

  // Get display label for current selection
  const getDisplayValue = () => {
    const currentValue = getCurrentSortValue()
    const currentOption = SORT_OPTIONS.find((option) => option.value === currentValue)
    return currentOption?.label || 'Select'
  }

  return (
    <div>
      <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue className="text-xs">{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {SORT_OPTIONS.map((option) => (
              <SelectItem className="text-xs" key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Sorting
