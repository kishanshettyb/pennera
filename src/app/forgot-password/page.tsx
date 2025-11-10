'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function ResetRequest() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const change_pssword_url = process.env.NEXT_PUBLIC_CHANGE_PASSWORD
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${change_pssword_url}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.status === 'success') {
        setMessage('✅ Password reset link sent to your email.')
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong.'}`)
      }
    } catch (error) {
      console.error(error)
      setMessage('❌ Unable to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password?</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter your email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />

          <Button size="lg" type="submit" disabled={loading} className="w-full  ">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Reset Link <ArrowRight />
              </>
            )}
          </Button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  )
}
