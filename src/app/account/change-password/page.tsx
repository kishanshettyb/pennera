'use client'

import { useState } from 'react'

// ✅ Helper: get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const change_password_url = process.env.NEXT_PUBLIC_NEXT_PUBLIC_CHANGE_PASSWORD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage('❌ New passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setMessage('❌ New password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Step 1: Get token
      const token = getCookie('jwt_token')

      if (!token) {
        setMessage('❌ Authentication token not found. Please log in again.')
        setLoading(false)
        return
      }

      // Step 2: Send password change request
      const res = await fetch(`${change_password_url}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      const data = await res.json()

      // Step 3: Handle response
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`)
      }

      if (data.status === 'success') {
        setMessage('✅ Password updated successfully. Please log in again.')

        // Logout: delete cookie
        document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        setTimeout(() => {
          window.location.href = '/auth'
        }, 2000)
      } else {
        setMessage(`❌ ${data.message}`)
      }
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Something went wrong.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-[60px] bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Current password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Enter current password"
              disabled={loading}
            />
          </div>

          {/* New password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Enter new password (min. 6 characters)"
              disabled={loading}
              minLength={6}
            />
          </div>

          {/* Confirm new password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Confirm new password"
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-600 text-white font-semibold py-2 rounded-lg hover:bg-slate-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
