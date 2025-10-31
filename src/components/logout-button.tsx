'use client'
import { Button } from '@/components/ui/button'
import { Fingerprint, ShoppingBag, User } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { useCustomerContext } from '@/use-customer-context'
import { useHeaderStore } from '@/store/useHeaderStore'

export function LogoutButton() {
  // const router = useRouter()

  const { logout } = useCustomerContext()

  const handleLogout = () => {
    logout()
    window.location.replace('/')
  }
  const { isFixed } = useHeaderStore()

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent group">
              <div className="flex  items-center flex-row">
                <User size={20} className={`${isFixed ? `text-white ` : `text-black`}`} />
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="flex flex-col gap-2 w-auto md:w-[180px] lg:w-[180px]  ">
                <NavigationMenuLink asChild>
                  <Link href="/account" className="flex-row flex items-center">
                    <User /> Profile
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/account/orders" className="flex-row flex items-center">
                    <ShoppingBag /> Orders
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/account/change-password" className="flex-row flex items-center">
                    <Fingerprint /> Change Password
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Button className="cursor-pointer" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}
