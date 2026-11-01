import { useEffect, useState } from 'react'

// Router mínimo basado en hash (#/lesson/tema-1): funciona en GitHub Pages sin configuración extra.
const getPath = () => window.location.hash.replace(/^#/, '') || '/'

export function useRoute() {
  const [path, setPath] = useState(getPath)
  useEffect(() => {
    const onChange = () => {
      setPath(getPath())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export const navigate = (to) => {
  window.location.hash = to
}

export function matchRoute(path) {
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'lesson' && parts[1]) return { name: 'lesson', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 'favorites') return { name: 'favorites' }
  return { name: 'home' }
}
