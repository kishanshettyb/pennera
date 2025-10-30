'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGetAllCategory } from '@/services/query/category/category'
import { Check, RefreshCcw, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Slider } from '@radix-ui/react-slider'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink']
const availability = ['In Stock', 'Out of Stock']

type Category = {
  id: number
  name: string
  parent: number
  count: number
  slug: string
}

interface ShopFiltersProps {
  onClose?: () => void
  isMobile?: boolean
}

function ShopFilters({ onClose, isMobile = false }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: categoriesData } = useGetAllCategory()

  // Initialize range from URL params or default
  const initialMin = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : 0
  const initialMax = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : 2000
  const [range, setRange] = useState<number[]>([initialMin, initialMax])

  // Update range when URL params change
  useEffect(() => {
    const min = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : 0
    const max = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : 2000
    setRange([min, max])
  }, [searchParams])

  const mainCategories =
    (categoriesData as Category[] | undefined)?.filter((cat) => cat.parent === 0) || []

  // Get filter values from URL
  const selectedCategoryIds = (searchParams.get('category') || '')
    .split(',')
    .filter(Boolean)
    .map(Number)

  const selectedSize = searchParams.get('size') || ''
  const selectedColor = searchParams.get('color') || ''
  const selectedAvailability = searchParams.get('availability') || ''

  const updateFilter = (key: string, value: string | number | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value !== undefined && value !== '' && value !== 0) {
      params.set(key, value.toString())
    } else {
      params.delete(key)
    }

    // Remove page parameter when filters change
    params.delete('page')

    router.replace(`?${params.toString()}`, { scroll: false })

    // Close mobile filters after applying
    if (isMobile && onClose) {
      setTimeout(onClose, 300)
    }
  }

  const handleCategory = (id: number) => {
    const currentCategories = (searchParams.get('category') || '')
      .split(',')
      .filter(Boolean)
      .map(Number)

    const newCategories = currentCategories.includes(id)
      ? currentCategories.filter((catId) => catId !== id)
      : [...currentCategories, id]

    updateFilter('category', newCategories.length > 0 ? newCategories.join(',') : undefined)
  }

  const handleSize = (size: string) => {
    const newSize = selectedSize === size ? '' : size
    updateFilter('size', newSize)
  }

  const handleColor = (color: string) => {
    const newColor = selectedColor === color ? '' : color
    updateFilter('color', newColor)
  }

  const handleAvailability = (status: string) => {
    const newStatus = selectedAvailability === status ? '' : status
    updateFilter('availability', newStatus)
  }

  const handlePrice = () => {
    updateFilter('min_price', range[0])
    updateFilter('max_price', range[1])
  }

  const clearAllFilters = () => {
    router.replace('/shop', { scroll: false })
    if (isMobile && onClose) {
      onClose()
    }
  }

  // Get active filters for display
  const getActiveFilters = () => {
    const active: { key: string; value: string }[] = []

    if (searchParams.get('category')) {
      active.push({ key: 'Category', value: 'Selected' })
    }
    if (searchParams.get('size')) {
      active.push({ key: 'Size', value: selectedSize })
    }
    if (searchParams.get('color')) {
      active.push({ key: 'Color', value: selectedColor })
    }
    if (searchParams.get('availability')) {
      active.push({ key: 'Availability', value: selectedAvailability })
    }
    if (searchParams.get('min_price') || searchParams.get('max_price')) {
      active.push({
        key: 'Price',
        value: `₹${searchParams.get('min_price') || 0} - ₹${searchParams.get('max_price') || 2000}`
      })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="w-full border rounded-xl border-slate-100">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Active Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs cursor-pointer"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="bg-gray-100 opacity-60 hover:opacity-100  px-2 py-1 rounded text-xs flex items-center gap-1"
              >
                <span className="font-medium">{filter.key}:</span>
                <span>{filter.value}</span>
                <button
                  onClick={() => updateFilter(filter.key.toLowerCase(), '')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={12} className="cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="border border-x-0 border-t-0 border-b-slate-100 p-4">
        <h2 className="text-lg font-semibold my-2">Categories</h2>
        <div className="flex flex-col text-xs gap-2">
          {mainCategories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id)
            return (
              <label
                key={cat.id}
                className={`flex justify-between items-center gap-2 cursor-pointer transition-opacity duration-200 ${
                  isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <div className="inline-flex gap-x-2 items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategory(cat.id)}
                    className="accent-black"
                  />
                  <span className="text-sm">{cat.name}</span>
                </div>
                <div className="text-xs text-gray-500">({cat.count})</div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border border-x-0 border-t-0 border-b-slate-100 p-4">
        <h2 className="text-lg font-semibold my-2">Availability</h2>
        <div className="flex flex-col text-xs opacity-60 hover:opacity-100 gap-2">
          {availability.map((status) => (
            <Button
              className="text-xs justify-center cursor-pointer"
              key={status}
              size="sm"
              variant={selectedAvailability === status ? 'default' : 'outline'}
              onClick={() => handleAvailability(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="border border-x-0 border-t-0 border-b-slate-100 p-4">
        <h2 className="text-lg font-semibold my-2">Size</h2>
        <div className="flex flex-wrap gap-2 ">
          {sizes.map((size) => (
            <Button
              key={size}
              className={`text-xs cursor-pointer opacity-60 hover:opacity-100 ${selectedSize === size ? `opacity-100` : `opacity-50`}`}
              size="sm"
              variant={selectedSize === size ? 'default' : 'outline'}
              onClick={() => handleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="border border-x-0 border-t-0 border-b-slate-100 p-4">
        <h2 className="text-lg font-semibold my-2">Colors</h2>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Button
              className={`text-xs cursor-pointer opacity-60 hover:opacity-100 ${selectedColor === color ? `opacity-100` : `opacity-50`}`}
              key={color}
              size="sm"
              variant={selectedColor === color ? 'default' : 'outline'}
              onClick={() => handleColor(color)}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border border-x-0 border-t-0 border-b-slate-100 p-4">
        <h2 className="text-lg font-semibold my-2">Price</h2>
        <div className="space-y-4 opacity-60 hover:opacity-100">
          <div>
            <p className="text-xs font-medium mb-2">
              Price range: ₹{range[0]} - ₹{range[1]}
            </p>
            <Slider
              min={0}
              max={5000}
              step={5}
              value={range}
              onValueChange={(val: number[]) => setRange(val as [number, number])}
              className="w-full cursor-pointer"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs w-full cursor-pointer"
            onClick={handlePrice}
          >
            <Check size={14} />
            Apply Price Range
          </Button>
        </div>
      </div>

      {/* Reset Filters */}
      <div className="px-4 py-6">
        <Button
          size="sm"
          variant="default"
          onClick={clearAllFilters}
          className="w-full cursor-pointer"
          disabled={activeFilters.length === 0}
        >
          <RefreshCcw size={14} /> Reset All Filters
        </Button>
      </div>
    </div>
  )
}

export default ShopFilters
