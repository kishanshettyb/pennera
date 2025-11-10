import ResetPassword from '@/components/reset-password'
import React, { Suspense } from 'react'

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </div>
  )
}

export default page
