'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { useCreateCustomer, useLoginCustomer } from '@/services/mutation/customers/customers'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // ✅ Use both signup and login mutations
  const loginMutation = useLoginCustomer()
  const { mutate: createCustomer, isError, error, isPending } = useCreateCustomer()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (!username) {
      const localPart = value.split('@')[0]
      setUsername(localPart)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !firstName || !lastName || !username || !password) {
      alert('Please fill in all fields.')
      return
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('username', username)
    formData.append('password', password)

    // ✅ Signup first
    createCustomer(formData, {
      onSuccess: () => {
        console.log('✅ Registration successful — logging in...')
        // ✅ Automatically log in with typed credentials
        loginMutation.mutate(
          { username, password },
          {
            onSuccess: () => {
              console.log('✅ Auto-login successful')
            },
            onError: (err) => {
              console.error('❌ Auto-login failed:', err)
            }
          }
        )
      },
      onError: (err) => {
        console.error('❌ Registration failed:', err)
      }
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              {/* Username */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </div>

            {/* Error message */}
            {isError && (
              <div className="mt-4 text-center text-sm text-red-500">Error: {error?.message}</div>
            )}

            {/* Sign-in link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/account" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
