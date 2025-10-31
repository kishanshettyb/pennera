'use client'
import * as React from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { MenuCategoryList } from './menuCategoryList'
import { useHeaderStore } from '@/store/useHeaderStore'

export function MenuItems() {
  const isFixed = useHeaderStore((state) => state.isFixed)
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/" className={`${isFixed ? `text-white` : `text-black`}`}>
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Shop dropdown categories */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${isFixed ? `text-white bg-transparent` : `text-black bg-transparent`}`}
          >
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent className="z-50 p-5">
            <MenuCategoryList />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/categories" className={`${isFixed ? `text-white` : `text-black`}`}>
              Categories
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/about" className={`${isFixed ? `text-white` : `text-black`}`}>
              About Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact" className={`${isFixed ? `text-white` : `text-black`}`}>
              Contact Us
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
