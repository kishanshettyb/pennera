'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const key = searchParams.get('key')
  const login = searchParams.get('login')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!key || !login) {
      setMessage('❌ Invalid password reset link.')
    }
  }, [key, login])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!key || !login) {
      setMessage('❌ Invalid or missing reset details.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('https://app.disanmart.com/wp-json/custom/v1/set-new-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password })
      })

      const data = await res.json()

      if (data.status === 'success') {
        setMessage('✅ Password successfully reset. Redirecting...')
        setTimeout(() => router.push('/auth'), 2000)
      } else {
        setMessage(`❌ ${data.message || 'Failed to reset password.'}`)
      }
    } catch (err) {
      console.error(err)
      setMessage('❌ Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

        {!key || !login ? (
          <p className="text-center text-red-600">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />

            <Button size="lg" type="submit" disabled={loading} className="w-full  ">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}

        {message && (
          <div className="p-4 rounded-xl flex justify-center items-center mx-auto    border my-5">
            <p className="text-center text-sm text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
