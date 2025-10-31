import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SmallBanner from '@/components/small-banner'

export default function NotFound() {
  return (
    <>
      <SmallBanner title="Page Not Found" image="/banner/banner-categories.png" />
      <div className="flex flex-col items-center justify-center py-[60px] text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="mb-6 text-lg">Sorry, the page you are looking for does not exist.</p>
        <Link href="/">
          <Button>
            <ArrowLeft />
            Go back home
          </Button>
        </Link>
      </div>
    </>
  )
}
