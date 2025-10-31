'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import AccountsMenu from './accounts-menu'

export function AccountsMenuDrawer() {
  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <div className="flex justify-start items-center gap-5 w-100 bg-slate-50 p-4  ">
          <Menu /> Accounts Menu
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0">
        <div className="w-full border-0 rounded-b-3xl">
          <AccountsMenu />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
