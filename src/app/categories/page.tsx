'use client'
import { useGetAllCategory } from '@/services/query/category/category'
import Image from 'next/image'
import React from 'react'
import SmallBanner from '@/components/small-banner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import FeaturesBar from '@/components/features-bar'

type Category = {
  id: number
  name: string
  slug: string
  parent: number
  display: string
  count: number
  image?: { src: string; alt: string }
}

function CategoryPage() {
  const { data: categories, isLoading, error } = useGetAllCategory()

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  if (error) return <p>Error loading categories</p>

  const mainCategories = categories.filter((cat: Category) => cat.display === 'default')

  // ✅ Helper: get total count including subcategories
  const getTotalCount = (categoryId: number): number => {
    const children = categories.filter(
      (cat: Category) => cat.parent === categoryId && cat.display === 'subcategories'
    )
    let total = 0

    for (const child of children) {
      total += child.count
      // recursive for sub-subcategories
      total += getTotalCount(child.id)
    }

    return total
  }

  return (
    <>
      <div>
        <SmallBanner title="Categories" image="/banner/banner-categories.png" />
      </div>

      <section className="py-20 lg:py-40 bg-slate-50">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mainCategories.map((category: Category) => {
              const totalCount = category.count + getTotalCount(category.id)

              return (
                <div
                  key={category.id}
                  className="relative rounded-md overflow-hidden shadow-md bg-white"
                >
                  <Link href={`/shop?category=${category.id}`}>
                    <Image
                      src={category.image?.src || '/placeholder.jpg'}
                      alt={category.image?.alt || category.name}
                      width={1000}
                      height={1000}
                      className="rounded-md object-cover h-[250px] lg:h-[350px] xl:h-[450px] w-full"
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/90 to-transparent"></div>

                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full text-center">
                      <h2 className="text-xl lg:text-3xl capitalize font-bold text-white mb-2">
                        {category.name}
                      </h2>
                      <div className="text-xs bg-white text-slate-900 font-semibold inline-block lg:text-sm p-1 px-3 rounded-sm">
                        {totalCount} Products
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="py-5 bg-[linear-gradient(to_right,#fdf2f8,#eef2ff,#eff6ff,#ecfdf5)]">
        <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
          <FeaturesBar />
        </div>
      </section>
    </>
  )
}

export default CategoryPage
