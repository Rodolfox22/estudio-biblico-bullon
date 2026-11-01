// Índice de lecciones.
// Cada lección vive en src/data/temas/ (tema-1.js, tema-2.js, ...) y se carga sola.
// Los archivos que empiezan con "_" (como _plantilla.js) se ignoran: sirven de guía.
//
// Una lección puede escribirse de dos maneras:
//  - Por bloques (recomendado): `blocks: [ { type: 'section', ... }, { type: 'question', ... }, ... ]`
//  - Formato anterior: `sections`, `versesSection` y `decision` (se convierte solo a bloques).

import { normalizeLesson, validateLesson } from '../lib/lessonUtils.js'

const modules = import.meta.glob(['./temas/*.js', '!./temas/_*.js'], { eager: true })

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))

export const lessons = entries.map(([, mod]) => normalizeLesson(mod.default))

// Avisos para quien edita lecciones (solo en desarrollo)
if (import.meta.env.DEV) {
  const seen = new Set()
  entries.forEach(([path], i) => {
    const l = lessons[i]
    const label = path.replace('./temas/', '')
    validateLesson(l, label).forEach((msg) => console.warn(msg))
    if (seen.has(l.id)) console.warn(`[${label}] id de lección duplicado: "${l.id}"`)
    seen.add(l.id)
  })
}

export const getLesson = (id) => lessons.find((l) => l.id === id)

// "Tema 1: Dios te ama" -> { kicker: "Tema 1", headline: "Dios te ama" }
export function splitTitle(title) {
  const i = title.indexOf(':')
  return i === -1
    ? { kicker: '', headline: title }
    : { kicker: title.slice(0, i).trim(), headline: title.slice(i + 1).trim() }
}
