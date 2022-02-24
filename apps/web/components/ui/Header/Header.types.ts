import type { ReactNode } from 'react'
import { Routes } from '@/lib/constants'

export interface SubLink {
  icon: ReactNode
  title: string
  description: string
  href: string
}

export interface HeaderLink {
  external?: boolean
  link: Routes | string
  text: string
}
