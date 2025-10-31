'use client'
import Link from 'next/link'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import Image from 'next/image'

type SubmenuItem = {
  id: number
  name: string
  slug: string
  link: string
}

export function MenuListItems({
  title,
  href,
  submenu,
  catImage
}: {
  title: string
  href: string
  catImage?: string
  submenu: SubmenuItem[]
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="block">
          {catImage && (
            <>
              <div className="overflow-hidden text-center flex justify-center  rounded mb-2">
                <Image
                  width={300}
                  height={300}
                  src={catImage}
                  alt={title}
                  className="w-full rounded h-[100px] object-cover   transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-md  text-center leading-none capitalize font-semibold   transition-colors">
                {title}
              </div>
            </>
          )}
        </Link>
      </NavigationMenuLink>

      {submenu && submenu.length > 0 && (
        <ul className="mt-0 ml-2">
          {submenu.map((item) => (
            <li key={item.id} className="py-1">
              <Link
                href={item.link}
                className="text-sm capitalize text-muted-foreground hover:text-foreground block"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
