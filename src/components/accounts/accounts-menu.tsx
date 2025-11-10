'use client'

import React from 'react'
import { ShoppingCart, User, MapPin, KeyRound, LogOut, Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCustomerContext } from '../../../use-customer-context'

type MenuItem = {
  id: number
  menuName: string
  menuLink: string
  icon: React.ReactNode
  isLogout?: boolean
}

const menuData: MenuItem[] = [
  {
    id: 3,
    menuName: 'Wishlist',
    menuLink: '/account/wishlist',
    icon: <Heart className="w-5 h-5 text-gray-600" />
  },
  {
    id: 4,
    menuName: 'Profile',
    menuLink: '/account',
    icon: <User className="w-5 h-5 text-gray-600" />
  },
  {
    id: 2,
    menuName: 'Orders',
    menuLink: '/account/orders',
    icon: <ShoppingCart className="w-5 h-5 text-gray-600" />
  },
  {
    id: 5,
    menuName: 'Address',
    menuLink: '/account/address',
    icon: <MapPin className="w-5 h-5 text-gray-600" />
  },
  {
    id: 6,
    menuName: 'Change Password',
    menuLink: '/account/change-password',
    icon: <KeyRound className="w-5 h-5 text-gray-600" />
  },
  {
    id: 7,
    menuName: 'Logout',
    menuLink: '#',
    icon: <LogOut className="w-5 h-5 text-red-500" />,
    isLogout: true
  }
]

function AccountsMenu() {
  const pathname = usePathname()
  // const router = useRouter()
  const { logout } = useCustomerContext()

  const handleLogout = async () => {
    try {
      await logout() // clear tokens, user, etc.
      window.location.replace('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="bg-slate-50 rounded-b-2xl  w-full lg:w-64">
      <ul>
        {menuData.map((item) => {
          const isActive = pathname === item.menuLink

          if (item.isLogout) {
            return (
              <li
                key={item.id}
                onClick={handleLogout}
                className="flex flex-row justify-start items-center gap-3 p-4 border border-t-0 last-of-type:border-b-0 border-b-slate-200 hover:bg-slate-100 cursor-pointer border-l-transparent"
              >
                {item.icon}
                <span className="text-red-500 font-medium">{item.menuName}</span>
              </li>
            )
          }

          return (
            <Link key={item.id} href={item.menuLink}>
              <li
                className={`flex flex-row justify-start items-center gap-3 p-4 border border-t-0 border-b-slate-200 hover:bg-slate-100 cursor-pointer 
                ${isActive ? 'border-l-4 border-l-slate-900 bg-slate-100' : 'border-l-transparent'}`}
              >
                {item.icon}
                <span className={`text-gray-800 ${isActive ? 'font-bold' : 'font-normal'}`}>
                  {item.menuName}
                </span>
              </li>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}

export default AccountsMenu
