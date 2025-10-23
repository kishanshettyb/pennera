'use client'
import { useEffect, useState } from 'react'

export default function GoldPriceTicker() {
  const prices = [
    { karat: '14K', price: '₹7,625' },
    { karat: '18K', price: '₹9,817' },
    { karat: '22K', price: '₹11,995' },
    { karat: '24K', price: '₹13,294.97' }
  ]

  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % prices.length)
        setAnimate(false)
      }, 300) // match animation duration
    }, 2000) // every 2s

    return () => clearInterval(interval)
  }, [prices.length])

  const current = prices[index]

  return (
    <div className="flex gap-2 items-center justify-center overflow-hidden w-[250px] border  rounded-2xl border-orange-100">
      <div className="w-[100px] flex justify-end">
        <p className="text-sm text-gray-700 font-medium">Gold Price</p>
      </div>
      <div className="w-[43px] text-md h-[43px] flex justify-center items-center bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB000] rounded-full text-gray-900 font-bold">
        {current.karat}
      </div>
      <div key={index} className="animate-slideDown text-sm text-gray-800 w-[100px] font-semibold">
        {current.price} <span className="opacity-50">/g</span>
      </div>
    </div>
  )
}
