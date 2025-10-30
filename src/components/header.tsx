'use client'

import { Heart, Sidebar, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SearchModal } from './search-modal'
import { LogoutButton } from './logout-button'
import { CartIcon } from './cart-icon'
import { CartSidebar } from './cart-sidebar'
import { useGetAllWishlist } from '@/services/query/wishlist/wishlist'
import { useCustomerContext } from '@/use-customer-context'
import { MenuItems } from './menu/menuItems'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { customerId } = useCustomerContext()

  // Fetch wishlist data
  const { data: wishlistData } = useGetAllWishlist(customerId!)

  // Calculate wishlist count
  const wishlistCount = wishlistData?.wishlist?.length || 0

  useEffect(() => {
    setMounted(true)

    const checkLoginStatus = () => {
      // ✅ Check both cookie and localStorage for consistency
      const token = getCookie('token') // or replace with your cookie name
      const session = localStorage.getItem('session')

      // Logged in if either exists
      const loggedIn = !!token || session === 'true'
      setIsLoggedIn(loggedIn)
    }

    checkLoginStatus()

    // 🔹 Listen for login/logout events
    window.addEventListener('storage', checkLoginStatus)
    window.addEventListener('loginStatusChange', checkLoginStatus)

    // 🔹 Optional: refresh check every few seconds (keeps state synced)
    const interval = setInterval(checkLoginStatus, 5000)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('loginStatusChange', checkLoginStatus)
      clearInterval(interval)
    }
  }, [isLoggedIn])

  const handleCartOpen = () => {
    setIsCartOpen(true)
  }

  const handleCartClose = () => {
    setIsCartOpen(false)
  }

  if (!mounted) {
    return (
      <div className="w-full py-10 flex justify-center">
        <Image
          className="w-auto h-[80px]"
          src="/logo.png"
          width="1000"
          height="1000"
          alt="Penerra"
        />
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="w-full hidden lg:block">
        <div className="w-full py-4 mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex items-center justify-between">
          <div>
            <Link href="/">
              <Image
                className="w-auto h-[60px]"
                src="/logo.png"
                width="1000"
                height="1000"
                alt="Penerra"
              />
            </Link>
          </div>

          <div>
            <MenuItems />
          </div>

          <div>
            <div className="flex justify-between gap-4 items-center">
              <SearchModal />

              {isLoggedIn ? (
                <div className="flex items-center">
                  <LogoutButton />
                </div>
              ) : (
                <Link href="/auth">
                  <User />
                </Link>
              )}

              {/* Wishlist Icon with Dynamic Count */}
              <Link href="/wishlist">
                <div className="relative">
                  {wishlistCount > 0 && (
                    <span className="inline-flex absolute -top-2 -right-2 w-[20px] h-[20px] rounded-full bg-red-600 justify-center items-center text-white text-sm font-semibold">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                  <Heart
                    className={`hover:animate-pulse ${wishlistCount > 0 ? 'text-red-500' : ''}`}
                    size="22"
                  />
                </div>
              </Link>

              <CartIcon onClick={handleCartOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="w-full block lg:hidden">
        <div className="flex px-4 border border-x-0 border-t-0 py-4 justify-between gap-0 items-center">
          <Sidebar />
          <Link href="/">
            <Image
              className="w-[150px] h-auto "
              src="/logo.png"
              width="1000"
              height="1000"
              alt="Penerra"
            />
          </Link>
          <div className="flex gap-4 items-center">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link href="/auth">
                <User />
              </Link>
            )}

            {/* Wishlist Icon with Dynamic Count - Mobile */}
            <Link href="/wishlist">
              <div className="relative">
                {wishlistCount > 0 && (
                  <span className="inline-flex absolute -top-2 -right-2 w-[20px] h-[20px] rounded-full bg-red-600 justify-center items-center text-white text-sm font-semibold">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
                <Heart
                  className={`hover:animate-pulse ${wishlistCount > 0 ? 'text-red-500' : ''}`}
                  size="22"
                />
              </div>
            </Link>

            <CartIcon onClick={handleCartOpen} />
            <SearchModal />
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  )
}

export default Header
