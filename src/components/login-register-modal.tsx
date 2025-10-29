'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignupForm } from './signup-form'
import { LoginForm } from './login-form'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'

export function LoginRegisterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full cursor-pointer">
          Proceed to checkout <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-left">Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex w-full  ">
            <Tabs className="w-full mb-5" defaultValue="account">
              <TabsList className="w-full">
                <TabsTrigger value="register">Register Account</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="register">
                <div className="p-0 lg:p-10 bg-slate-100 rounded-2xl">
                  <div className="mb-5">
                    <h2 className="text-center flex justify-center items-center gap-x-5 font-semibold text-lg">
                      <UserPlus />
                      Register your account
                    </h2>
                  </div>
                  <SignupForm />
                </div>
              </TabsContent>
              <TabsContent value="login">
                <div className="p-0 lg:p-10 bg-slate-100 rounded-2xl">
                  <div className="mb-5">
                    <h2 className="text-center flex justify-center items-center gap-x-5 font-semibold text-lg">
                      <LogIn />
                      Login
                    </h2>
                  </div>
                  <LoginForm />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
