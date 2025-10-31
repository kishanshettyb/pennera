'use client'

import * as React from 'react'
import { Menu, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import Image from 'next/image'
import Link from 'next/link'
import { useHeaderStore } from '@/store/useHeaderStore'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { isFixed } = useHeaderStore()

  React.useEffect(() => {
    setMounted(true)

    const checkLoginStatus = () => {
      const token = getCookie('token') // cookie name
      const session = localStorage.getItem('session')
      const loggedIn = !!token || session === 'true'
      setIsLoggedIn(loggedIn)
    }

    checkLoginStatus()
    window.addEventListener('storage', checkLoginStatus)
    window.addEventListener('loginStatusChange', checkLoginStatus)
    const interval = setInterval(checkLoginStatus, 5000)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('loginStatusChange', checkLoginStatus)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null // avoid hydration mismatch

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Menu size={20} className={`${isFixed ? `text-white` : `text-black`}`} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="border border-x-0 border-t-0 border-b-slate-200">
            <DrawerTitle>
              <Image
                className="w-auto h-[40px]"
                src="/logo.png"
                width={1000}
                height={1000}
                alt="Disanmart"
              />
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <ul className="flex flex-col justify-start items-start gap-5">
              <li className="opacity-100 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/">Home</Link>
                </DrawerClose>
              </li>
              <li className="opacity-70 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/shop">Shop</Link>
                </DrawerClose>
              </li>
              <li className="opacity-70 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/categories">Categories</Link>
                </DrawerClose>
              </li>
              <li className="opacity-70 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DrawerClose>
              </li>
              <li className="opacity-70 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/about">About Us</Link>
                </DrawerClose>
              </li>
              <li className="opacity-70 hover:opacity-100 cursor-pointer">
                <DrawerClose asChild>
                  <Link href="/contact">Contact Us</Link>
                </DrawerClose>
              </li>
            </ul>
          </div>

          <DrawerFooter className="bottom-0 absolute w-full">
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </Link>

            <DrawerClose asChild>
              {isLoggedIn ? (
                <Link href="/account">
                  <Button className="w-full">
                    <User className="mr-2" />
                    Account
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button className="w-full">
                    <LogIn className="mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
