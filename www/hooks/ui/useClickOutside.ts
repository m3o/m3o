import { useCallback, useRef, useEffect } from 'react'

interface UseClickOutsideProps {
  trigger?: boolean
  onClickOutside: VoidFunction
}

export function useClickOutside({
  trigger = true,
  onClickOutside,
}: UseClickOutsideProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as HTMLElement) &&
        trigger
      ) {
        onClickOutside()
      }
    },
    [trigger, onClickOutside],
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])

  return elementRef
}
