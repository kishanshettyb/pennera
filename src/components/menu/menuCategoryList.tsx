'use client'

import React from 'react'
import { useGetAllCategory } from '@/services/query/category/category'
import { Loader2 } from 'lucide-react'
import { MenuListItems } from './menuListItems'

type SubmenuItem = {
  id: number
  name: string
  slug: string
  link: string
}

type CategoryItem = {
  id: number
  name: string
  slug: string
  parent: number
  catImage?: string
  submenu: SubmenuItem[]
  link: string
}

export function MenuCategoryList() {
  const { data: menuData, isLoading } = useGetAllCategory()
  const parentCategories: CategoryItem[] = []
  const subcategoriesMap: Record<number, SubmenuItem[]> = {}
  /* eslint-disable */
  menuData?.forEach((cat: any) => {
    const link = `/shop?category=${cat.id}`
    const submenuItem = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      link
    }
    /* eslint-enable */

    // ✅ Add category image safely
    const catImage = cat?.image?.src || '/no-image.png'

    if (cat.parent === 0) {
      // ✅ Include catImage here
      parentCategories.push({ ...cat, catImage, submenu: [], link })
    } else {
      if (!subcategoriesMap[cat.parent]) subcategoriesMap[cat.parent] = []
      subcategoriesMap[cat.parent].push(submenuItem)
    }
  })

  // ✅ Attach subcategories to parents
  parentCategories.forEach((parent) => {
    parent.submenu = subcategoriesMap[parent.id] || []
  })

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-[400px] gap-4 md:w-[500px] lg:w-[700px]">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <ul className="grid w-[400px] gap-4 md:w-[500px] md:grid-cols-3 lg:grid-cols-4 lg:w-[700px]">
          {parentCategories.map((category) => (
            <MenuListItems
              key={category.id}
              title={category.name}
              href={category.link}
              submenu={category.submenu}
              catImage={category.catImage}
            />
          ))}
        </ul>
      )}
    </>
  )
}
