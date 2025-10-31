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
  submenu: SubmenuItem[]
  link: string
}

export function MenuCategoryList() {
  const { data: menuData, isLoading } = useGetAllCategory()
  const parentCategories: CategoryItem[] = []
  const subcategoriesMap: Record<number, SubmenuItem[]> = {}

  menuData?.forEach(
    (cat: {
      slug: string
      id: number
      name: string
      parent: number
      submenu?: SubmenuItem[]
      link?: string
    }) => {
      const link = `/shop?category=${cat.id}`
      const submenuItem = { id: cat.id, name: cat.name, slug: cat.slug, link }

      if (cat.parent === 0) {
        parentCategories.push({ ...cat, submenu: [], link })
      } else {
        if (!subcategoriesMap[cat.parent]) subcategoriesMap[cat.parent] = []
        subcategoriesMap[cat.parent].push(submenuItem)
      }
    }
  )

  // attach subcategories to parents
  parentCategories.forEach((parent) => {
    parent.submenu = subcategoriesMap[parent.id] || []
  })

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-[400px] gap-4 md:w-[500px]   lg:w-[700px]">
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
            />
          ))}
        </ul>
      )}
    </>
  )
}
