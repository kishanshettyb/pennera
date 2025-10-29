export type WishlistItem = {
  id: number
  user_id: number
  product_id: number
  created_at?: string
}

export type AddWishlistData = {
  user_id: number
  product_id: number
}

export type RemoveWishlistData = {
  user_id: number
  product_id: number
}
