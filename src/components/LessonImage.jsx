import { useState } from 'react'

export const assetUrl = (src) => (/^(https?:|data:)/.test(src) ? src : import.meta.env.BASE_URL + src.replace(/^\//, ''))

// Si la imagen no carga (sin conexión, URL rota) se muestra el degradado del tema.
export default function LessonImage({ src, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div className={`grad-banner ${className}`} aria-hidden="true" />
  return <img src={assetUrl(src)} alt="" loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
}
