import { useEffect } from 'react'

interface Props {}

export function M3OApps({}: Props) {
  useEffect(() => {
    ;(async () => {
      const response = await fetch('https://api.m3o.com/v1/app/List', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      let json = await response.json()

      console.log(json)
    })()
  }, [])

  return <div>index</div>
}
