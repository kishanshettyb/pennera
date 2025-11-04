import { NextResponse } from 'next/server'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const token = (await cookies()).get('jwt_token')?.value
    const storeUrl = process.env.NEXT_PUBLIC_STORE_URL

    console.log('🛒 [Cart API] Starting request...')
    console.log('🧩 Store URL:', storeUrl)
    console.log('🔑 JWT Token found:', token ? '✅ Yes' : '❌ No')

    let response

    if (token) {
      console.log('➡️ Using Bearer Token Authentication')
      try {
        response = await axios.get(`${storeUrl}cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (err) {
        console.error('❌ [Bearer Auth] Request failed:')
        if (axios.isAxiosError(err)) {
          console.error('Status:', err.response?.status)
          console.error('Data:', err.response?.data)
        } else {
          console.error(err)
        }
        throw err
      }
    } else {
      console.log('➡️ Using Basic Auth (Guest Cart)')
      try {
        response = await axios.get(`${storeUrl}cart`, {
          auth: {
            username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
            password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (err) {
        console.error('❌ [Basic Auth] Request failed:')
        if (axios.isAxiosError(err)) {
          console.error('Status:', err.response?.status)
          console.error('Data:', err.response?.data)
        } else {
          console.error(err)
        }
        throw err
      }
    }

    console.log('✅ [Cart API] Success - Status:', response.status)

    const res = NextResponse.json(response.data, { status: response.status })

    if (response.headers['nonce']) {
      res.headers.set('nonce', response.headers['nonce'])
      console.log('🧾 Nonce header forwarded:', response.headers['nonce'])
    }

    return res
  } catch (error: unknown) {
    console.error('🚨 [Cart API] Error caught in main try/catch')

    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      return NextResponse.json(
        { error: error.response?.data || 'Error fetching cart' },
        { status: error.response?.status || 500 }
      )
    }

    console.error('Unknown error:', error)
    return NextResponse.json({ error: 'Unknown error fetching cart' }, { status: 500 })
  }
}
