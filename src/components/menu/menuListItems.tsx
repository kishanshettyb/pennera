'use client'
import Link from 'next/link'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

type SubmenuItem = {
  id: number
  name: string
  slug: string
  link: string
}

export function MenuListItems({
  title,
  href,
  submenu
}: {
  title: string
  href: string
  submenu: SubmenuItem[]
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className="block">
          <div className="text-md leading-none capitalize font-semibold">{title}</div>
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
