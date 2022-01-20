import { useState } from 'react'

interface UseOnlyOneOpenItem {
  toggleItem: (item: string) => void
  isOpen: (item: string) => boolean
}

export function useOnlyOneOpenItem(): UseOnlyOneOpenItem {
  const [openItem, setOpenItem] = useState('')

  function toggleItem(item: string): void {
    setOpenItem((prevItem) => (prevItem === item ? '' : item))
  }

  function isOpen(item: string): boolean {
    return item === openItem
  }

  return {
    toggleItem,
    isOpen
  }
}
