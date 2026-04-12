import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api.js'

export function useContentCollection(pathname, fallbackItems) {
  const [items, setItems] = useState(fallbackItems)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function loadCollection() {
      try {
        const payload = await apiRequest(pathname, {
          signal: controller.signal,
        })

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
