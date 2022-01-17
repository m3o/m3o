import { useCallback, useState } from 'react'

export function useSelectItems<T extends Record<string, unknown>>() {
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const onSelectItem = useCallback((item: T) => {
    setSelectedItems((prevItems) => {
      const jsonItem = JSON.stringify(item)
      const found = prevItems.some(
        (prevItem) => JSON.stringify(prevItem) === jsonItem
      )

      if (found) {
        return prevItems.filter(
          (prevItem) => JSON.stringify(prevItem) !== jsonItem
        )
      }

      return [...prevItems, item]
    })
  }, [])

  const resetSelectedItems = useCallback(() => {
    setSelectedItems(() => [])
  }, [])

  return {
    onSelectItem,
    selectedItems,
    resetSelectedItems
  }
}
