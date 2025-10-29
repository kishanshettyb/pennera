'use client'

import { useGetAllCategory } from '@/services/query/category/category'
import CategorySlider from '@/components/category-slider'
import { Loader2 } from 'lucide-react'

interface CategorySectionProps {
  showLoadingState?: boolean
  showErrorState?: boolean
}

export default function CategorySection({
  showLoadingState = true,
  showErrorState = true
}: CategorySectionProps) {
  const { data: categoriesData, isLoading, error } = useGetAllCategory()

  // Ensure data is always an array
  const categoriesArray = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [] // handle if API response has a `data` property

  const transformedCategories =
    categoriesArray
      ?.filter(
        (category: { parent: number; name: string }) =>
          category.parent === 0 && category.name !== 'Uncategorized'
      )
      .map(
        (category: {
          id: string
          name: string
          count: number
          image?: { src: string }
          slug: string
          display: string
        }) => ({
          id: category.id,
          categoryName: category.name,
          totalItems: category.count,
          categoryImage: category.image?.src || '/no-image.png',
          slug: category.slug,
          display: category.display,
          subcategories:
            categoriesArray?.filter((sub: { parent: string }) => sub.parent === category.id) || []
        })
      ) || []

  if (isLoading && showLoadingState) {
    return (
      <div className="flex w-full m-auto flex-col justify-between items-center text-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error && showErrorState) {
    return <div>Error loading categories</div>
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
      <CategorySlider items={transformedCategories} />
    </div>
  )
}
