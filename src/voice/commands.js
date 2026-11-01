import { normalize, wordsToDigits } from '../lib/text.js'

/**
 * Interpreta una frase dictada como comando. Solo es comando si TODA la frase coincide;
 * si no, se trata como dictado (así puedes dictar "siguiente" dentro de una respuesta larga).
 */
export function matchCommand(raw) {
  const t = normalize(raw).replace(/[.,:]+$/g, '')
  if (!t) return null

  if (/^(siguiente|siguiente pregunta|proxima pregunta|pregunta siguiente|proxima)$/.test(t)) return { name: 'next' }
  if (/^(anterior|pregunta anterior|volver a la pregunta anterior)$/.test(t)) return { name: 'prev' }

  if (/^(volver|ir|vamos) (al )?(inicio|portada)$|^(inicio|portada|volver a la portada)$/.test(t)) return { name: 'home' }
  if (/^(abrir |ver |ir a |mostrar )?(mis )?favoritos$/.test(t)) return { name: 'favorites' }
  if (/^(cerrar|cerrar versiculo|cerrar ventana|cerrar popup)$/.test(t)) return { name: 'closeVerse' }

  let m = t.match(/^(?:ir a|abrir|ver|ve a|vamos a)\s+(?:la\s+)?(?:leccion|tema)\s+(.+)$/)
  if (m) return { name: 'goLesson', query: m[1] }

  m = t.match(/^(?:abrir|ver|mostrar|leer|abre)\s+(?:el\s+)?versiculo\s+(.+)$/)
  if (m) return { name: 'openVerse', ref: m[1] }

  return null
}

export function resolveLesson(query, lessons) {
  const q = wordsToDigits(query).replace(/^(numero|n)\s*/, '')
  const num = q.match(/^\d+$/) && parseInt(q, 10)
  if (num) return lessons[num - 1] || null

  const clean = (title) => normalize(title.replace(/^tema\s*\d+\s*:/i, ''))
  return (
    lessons.find((l) => {
      const title = clean(l.title)
      return title.includes(q) || (q.length > 3 && q.includes(title))
    }) ||
    lessons.find((l) => (l.keywords || []).some((k) => normalize(k) === q)) ||
    null
  )
}
