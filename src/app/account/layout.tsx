// src/account/layout.tsx
'use client'
import AccountsMenu from '@/components/accounts/accounts-menu'
import { AccountsMenuDrawer } from '@/components/accounts/accounts-menu-drawer'
import { LoginForm } from '@/components/login-form'
import SmallBanner from '@/components/small-banner'
import React, { useEffect, useState } from 'react'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const session = localStorage.getItem('session')
      setIsLoggedIn(session === 'true')
    }

    checkLoginStatus()
    window.addEventListener('storage', checkLoginStatus)
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  return (
    <section className="border border-x-0 border-b-0">
      {isLoggedIn ? (
        <div className="w-full">
          <SmallBanner title="Account" image="/banner/banner-categories.png" />
          <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-5 lg:py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
            <div className="flex flex-col lg:flex-row justify-start items-start gap-5">
              <div className="hidden lg:block">
                <AccountsMenu />
              </div>
              <div className="block lg:hidden">
                <AccountsMenuDrawer />
              </div>
              <div className="w-full rounded-2xl">{children}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full py-20  mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex flex-col items-center justify-between">
          <div className="w-full lg:w-2/5 ">
            <h2 className="text-3xl text-center font-semibold mb-5">Login</h2>
            <LoginForm />
          </div>
        </div>
      )}
    </section>
  )
}
