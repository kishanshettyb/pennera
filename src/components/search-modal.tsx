'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useGetAllSearchProducts } from '@/services/query/products/product'
import { Product } from '@/types/productTypes'
import { Search, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
export function SearchModal() {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError, refetch } = useGetAllSearchProducts({ search }, false)

  // Then call refetch() when the user types
  useEffect(() => {
    if (search.trim()) {
      refetch()
    }
  }, [search, refetch])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Search className="hover:animate-pulse cursor-pointer" size="20" />
      </DialogTrigger>

      <DialogContent className="min-w-[60%] max-w-none">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Search input */}
          <div className="grid gap-3">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="border border-slate-100 rounded-md mt-5 pt-5 bg-slate-50 p-4  h-[50vh] overflow-scroll  flex items-start   justify-start">
            {isLoading && (
              <div className="flex flex-row gap-5 items-center w-full mx-auto justify-center py-10">
                <Loader2 className="animate-spin" /> Loading...
              </div>
            )}

            {isError && <p className="text-red-500">Error loading products</p>}

            {!isLoading && data?.length === 0 && (
              <div className="w-full">
                <p className="text-gray-500 text-center">No products found</p>
              </div>
            )}

            <div className="gap-5 w-full flex flex-col justify-start    rounded-2xl">
              {data?.map((product: Product) => (
                <div key={product.id} className="group border rounded-2xl ">
                  <DialogClose asChild>
                    <Link href={`/product?slug=${product.slug}`}>
                      <div className="flex items-center gap-5 border-b pb-3 last:border-b-0   w-full p-4 group-hover:shadow-2xl  group-hover:rounded-2xl group-hover:shadow-amber-100 group-hover:bg-white">
                        <Image
                          alt={product.name}
                          src={product.images?.[0]?.src || '/placeholder.png'}
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] object-cover border rounded-md"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">{product.name}</h2>
                          <p className="text-gray-700">₹{product.price}</p>
                        </div>
                      </div>
                    </Link>
                  </DialogClose>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
