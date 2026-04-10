import { useEffect, useState } from 'react'
import { buildApiUrl } from '../lib/api.js'

export function useContentCollection(pathname, fallbackItems) {
  const [items, setItems] = useState(fallbackItems)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function loadCollection() {
      try {
        const response = await fetch(buildApiUrl(pathname), {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()

        if (!cancelled && Array.isArray(payload.items)) {
          setItems(payload.items.length ? payload.items : fallbackItems)
        }
      } catch (error) {
        if (error.name === 'AbortError' || cancelled) {
          return
        }

        console.error(`Failed to load ${pathname}`, error)
        setItems(fallbackItems)
      }
    }

    loadCollection()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fallbackItems, pathname])

  return { items }
}
