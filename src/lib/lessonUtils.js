import { parseReference } from './reference.js'

// Tipos de bloque que sabe dibujar la app (ver src/components/LessonBlocks.jsx)
export const BLOCK_TYPES = ['section', 'text', 'list', 'callout', 'banner', 'question', 'verses', 'image', 'decision']

export const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v])

function normalizeBlock(b) {
  if (b.type === 'question') return { ...b, bibleRefs: [...asArray(b.bibleRefs), ...asArray(b.bibleRef)] }
  return b
}

/**
 * Toda lección termina como { ...lección, blocks: [...] }.
 * - Formato nuevo: ya trae `blocks`.
 * - Formato anterior (sections / versesSection / decision): se convierte automáticamente.
 */
export function normalizeLesson(lesson) {
  if (Array.isArray(lesson.blocks)) return { ...lesson, blocks: lesson.blocks.map(normalizeBlock) }

  const blocks = []
  for (const s of lesson.sections ?? []) {
    blocks.push({ type: 'section', title: s.title })
    for (const q of s.questions ?? []) blocks.push(normalizeBlock({ type: 'question', ...q }))
  }
  if (lesson.versesSection?.length) {
    blocks.push({ type: 'section', title: 'Versículos para meditar' })
    blocks.push({ type: 'verses', refs: lesson.versesSection })
  }
  if (lesson.decision) blocks.push({ type: 'decision', ...lesson.decision })
  return { ...lesson, blocks }
}

export const getQuestions = (lesson) => lesson.blocks.filter((b) => b.type === 'question')

/** Todas las citas de una lección (para descargarlas y usarlas sin conexión). */
export function collectRefs(lesson) {
  const refs = []
  for (const b of lesson.blocks) {
    if (b.type === 'question') refs.push(...b.bibleRefs)
    else if (['banner', 'callout', 'verses'].includes(b.type)) refs.push(...asArray(b.refs))
  }
  return [...new Set(refs)]
}

/** Devuelve una lista de avisos legibles; se muestran en la consola durante `npm run dev`. */
export function validateLesson(lesson, label = lesson?.id) {
  const w = []
  const at = (msg) => w.push(`[${label}] ${msg}`)
  if (!lesson.id) at('falta `id`')
  if (!lesson.title) at('falta `title`')

  const qIds = new Set()
  const dIds = new Set()
  lesson.blocks.forEach((b, i) => {
    const where = `bloque #${i + 1} (${b.type})`
    if (!BLOCK_TYPES.includes(b.type)) return at(`${where}: tipo desconocido. Tipos válidos: ${BLOCK_TYPES.join(', ')}`)
    if (b.type === 'section' && !b.title) at(`${where}: falta \`title\``)
    if (b.type === 'text' && !asArray(b.content).length) at(`${where}: falta \`content\``)
    if (b.type === 'list' && !asArray(b.items).length) at(`${where}: falta \`items\``)
    if (b.type === 'image' && !b.src) at(`${where}: falta \`src\``)
    if (b.type === 'question') {
      if (!b.id) at(`${where}: falta \`id\` (se usa para guardar la respuesta)`)
      else if (qIds.has(b.id)) at(`${where}: id de pregunta duplicado "${b.id}"`)
      qIds.add(b.id)
      if (!b.text) at(`${where}: falta \`text\``)
    }
    if (b.type === 'decision') {
      if (!b.checkboxLabel) at(`${where}: falta \`checkboxLabel\``)
      const key = b.id ?? ''
      if (dIds.has(key)) at(`${where}: hay varias decisiones; dale un \`id\` distinto a cada una`)
      dIds.add(key)
    }
    const refs = b.type === 'question' ? b.bibleRefs : ['banner', 'callout', 'verses'].includes(b.type) ? asArray(b.refs) : []
    for (const r of refs) if (!parseReference(r)) at(`${where}: no pude interpretar la cita "${r}"`)
  })
  return w
}
