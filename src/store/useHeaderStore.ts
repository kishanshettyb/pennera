'use client'
import { create } from 'zustand'
/* eslint-disable*/
type HeaderState = {
  isFixed: boolean
  setIsFixed: (value: boolean) => void
}

export const useHeaderStore = create<HeaderState>((set) => ({
  isFixed: true,
  setIsFixed: (value) => set({ isFixed: value })
}))
/* eslint-enable*/
