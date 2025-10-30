'use client'
import SmallBanner from '@/components/small-banner'
import { useGetPageDetails } from '@/services/query/pages/pages'
import { Loader2 } from 'lucide-react'
import React from 'react'

function AboutPage({ slug = 'about' }: { slug: string }) {
  const { data: pages, isLoading, error } = useGetPageDetails(slug)

  return (
    <div>
      <SmallBanner title="About Us" image="/banner/banner-categories.png" />
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-4xl" />
        </div>
      ) : error ? (
        <p className="text-center py-20 text-red-500">Error loading pages</p>
      ) : (
        <>
          <div className="border border-x-0 border-t-slate-200 border-b-0 py-20">
            <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
              <div
                className="pageContent"
                dangerouslySetInnerHTML={{ __html: pages[0]?.content.rendered }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AboutPage
