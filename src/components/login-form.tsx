'use client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { useLoginCustomer } from '@/services/mutation/customers/customers'
import { Button } from './ui/button'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const loginMutation = useLoginCustomer()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({
      username: formData.username,
      password: formData.password
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex flex-row justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <a
                  href="/forgot-password"
                  className="ml-auto justify-end inline-block text-xs underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-xs">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
