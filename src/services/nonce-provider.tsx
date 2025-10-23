'use client'

import { useEffect } from 'react'
import { getStoreNonceToken } from '@/services/api/cart-store/cart'

export default function NonceProvider() {
  useEffect(() => {
    const fetchNonce = async () => {
      try {
        const nonce = await getStoreNonceToken()
        if (nonce) {
          console.log('✅ Nonce stored in localStorage:', nonce)
        }
      } catch (error) {
        console.error('❌ Failed to fetch nonce:', error)
      }
    }

    fetchNonce()
  }, [])

  return null // no UI, just logic
}
