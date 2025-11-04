import { NextResponse } from 'next/server'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function POST() {
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL
  const clientAuth = {
    username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    password: process.env.NEXT_PUBLIC_CLIENT_SECRET!
  }

  try {
    // STEP 0: Get JWT token from cookies
    const jwtToken = (await cookies()).get('jwt_token')?.value
    if (!jwtToken) {
      return NextResponse.json({ error: 'No JWT token found' }, { status: 401 })
    }

    // STEP 1: Fetch guest cart with nonce
    let guestCart
    let guestNonce = ''
    try {
      const res = await axios.get(`${storeUrl}cart`, {
        auth: clientAuth,
        headers: { 'Content-Type': 'application/json' }
      })
      guestCart = res.data
      guestNonce = res.headers['nonce'] || guestCart?.cart_nonce || guestCart?.nonce || ''
    } catch {
      throw new Error('Guest cart fetch failed')
    }

    const guestItems = guestCart?.items || []
    if (guestItems.length === 0) {
      return NextResponse.json({ message: 'No guest cart items to transfer' })
    }

    // STEP 2: Fetch nonce for logged-in user cart
    let userNonce = ''
    try {
      const nonceRes = await axios.get(`${storeUrl}cart`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      })
      userNonce = nonceRes.headers['nonce'] || nonceRes.data?.cart_nonce || nonceRes.data?.nonce
      if (!userNonce) throw new Error('Nonce not found in response')
    } catch {
      throw new Error('Failed to get nonce for logged-in cart')
    }

    // STEP 3: Add each item to logged-in cart
    const addedItems: unknown[] = []
    const failedItems: unknown[] = []

    for (const item of guestItems) {
      const payload: unknown = {
        id: item.id,
        quantity: item.quantity
      }

      if (item.variation && Object.keys(item.variation).length > 0) {
        payload.variation = item.variation
      }

      try {
        const res = await axios.post(`${storeUrl}cart/add-item`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
            nonce: userNonce
          }
        })
        addedItems.push({
          originalItem: item,
          response: res.data
        })
      } catch (err) {
        failedItems.push({
          originalItem: item,
          error: err
        })
      }
    }

    // STEP 4: Remove successfully added items from guest cart
    if (addedItems.length > 0 && guestNonce) {
      for (const addedItem of addedItems) {
        const itemKey = addedItem.originalItem.key
        try {
          await axios.post(
            `${storeUrl}cart/remove-item?key=${itemKey}`,
            {},
            {
              auth: clientAuth,
              headers: {
                'Content-Type': 'application/json',
                nonce: guestNonce
              }
            }
          )
        } catch {
          // ignore guest cart cleanup errors silently
        }
      }
    }

    // Final response
    const response = NextResponse.json({
      message: 'Cart merge completed',
      summary: {
        totalGuestItems: guestItems.length,
        successfullyAdded: addedItems.length,
        failedToAdd: failedItems.length,
        addedItems: addedItems.map((item) => ({
          id: item.originalItem.id,
          key: item.originalItem.key,
          quantity: item.originalItem.quantity
        })),
        failedItems: failedItems.map((item) => ({
          id: item.originalItem.id,
          key: item.originalItem.key,
          quantity: item.originalItem.quantity
        }))
      }
    })

    if (userNonce) {
      response.headers.set('nonce', userNonce)
    }

    return response
  } catch {
    return NextResponse.json({ error: 'Failed to merge carts' }, { status: 500 })
  }
}
