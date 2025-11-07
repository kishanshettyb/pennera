'use client'

import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ArrowLeft, LogIn, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()

  return (
    <>
      <div className="py-40 flex flex-col items-center justify-start bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Account</h1>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="register" className="w-1/2">
                Register
              </TabsTrigger>
              <TabsTrigger value="login" className="w-1/2">
                Login
              </TabsTrigger>
            </TabsList>

            {/* Register Tab */}
            <TabsContent value="register">
              <div className="p-0 pt-4  lg:p-8 bg-slate-100 rounded-2xl">
                <div className="mb-5 text-center">
                  <h2 className="flex justify-center items-center gap-x-3 font-semibold text-lg">
                    <UserPlus />
                    Register your account
                  </h2>
                </div>
                <SignupForm />
              </div>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login">
              <div className="p-0 pt-4 lg:p-8 bg-slate-100 rounded-2xl">
                <div className="mb-5 text-center">
                  <h2 className="flex justify-center items-center gap-x-3 font-semibold text-lg">
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
    </>
  )
}
