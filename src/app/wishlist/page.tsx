import SmallBanner from '@/components/small-banner'
import Wishlist from '@/components/wishlist'
import React from 'react'

function WishlistPage() {
  return (
    <>
      <SmallBanner title="Wishlist" image="/banner/banner-categories.png" />

      <Wishlist />
    </>
  )
}

export default WishlistPage
