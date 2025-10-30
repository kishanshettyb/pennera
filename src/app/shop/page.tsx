import ProductsListGridWithPagination from '@/components/products/productListGridWithPagination'
import ShopFilters from '@/components/products/shop-filters'
import SmallBanner from '@/components/small-banner'
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <SmallBanner title="Shop" image="/banner/banner-categories.png" />
      <div className="w-full py-10 mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex flex-row gap-x-10 items-start justify-start">
        <div className="hidden bg-slate-50 rounded-2xl lg:block w-1/5">
          <Suspense fallback={<>...</>}>
            <ShopFilters />
          </Suspense>
        </div>
        <div className="w-full lg:w-4/5">
          <Suspense fallback={<>...</>}>
            <ProductsListGridWithPagination />
          </Suspense>
        </div>
      </div>
    </>
  )
}
