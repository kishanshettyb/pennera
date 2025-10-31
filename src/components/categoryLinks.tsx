'use client'

import { useGetAllCategory } from '@/services/query/category/category'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type CategoryItem = {
  id: number
  name: string
  slug: string
  parent: number
  catImage?: string
  link: string
}

function CategoryLinks() {
  const { data: menuData, isLoading } = useGetAllCategory()

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-5 text-white bg-[#c19144]">
        Loading categories...
      </div>
    )
  }

  // Filter top-level categories (parent = 0)
  /* eslint-disable */
  const parentCategories: CategoryItem[] =
    menuData
      ?.filter((cat: any) => cat.parent === 0)
      ?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parent: cat.parent,
        link: `/shop?category=${cat.id}`,
        catImage: cat?.catImage || '/no-image.png'
      })) || []
  /* eslint-enable */

  return (
    <section className="w-full py-10 bg-[#c19144]">
      <h2 className="text-4xl md:text-6xl lg:text-8xl uppercase font-semibold text-center my-10 text-white">
        PENERRA - Redefining Royalty in Gold.
      </h2>
      {parentCategories.map((category) => (
        <Link href={category.link} key={category.id}>
          <div className="flex flex-row justify-between items-center px-12 border-2 border-b-0 border-x-0 border-t-white/40 py-5 bg-[#c19144] hover:bg-black transition-colors">
            <div>
              <h2 className="text-3xl md:text-4xl uppercase text-white">{category.name}</h2>
            </div>
            <div>
              <ArrowRight size={40} className="text-white" />
            </div>
          </div>
        </Link>
      ))}
    </section>
  )
}

export default CategoryLinks
