import { parseReference } from './reference.js'
import { KEYS, read, write } from './storage.js'
import { collectRefs } from './lessonUtils.js'

// API gratuita de AO Lab (sin clave): https://bible.helloao.org
// Nota: bible-api.com (Tim Morgan) NO incluye ninguna versión en español.
const API = 'https://bible.helloao.org/api'

export const DEFAULT_TRANSLATION = 'spa_r09' // Reina-Valera 1909 (la más cercana a RVR1960 disponible)
export const FALLBACK_TRANSLATIONS = [
  { id: 'spa_r09', name: 'Reina-Valera 1909', shortName: 'RVR1909' }
]

export class BibleError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

/* ---------- Lista de versiones en español ---------- */
export async function loadSpanishTranslations() {
  const cached = read(KEYS.translations, null)
  try {
    const res = await fetch(`${API}/available_translations.json`)
    if (!res.ok) throw new Error('http')
    const data = await res.json()
    const list = (data.translations || [])
      .filter((t) => t.language === 'spa' || String(t.id).startsWith('spa_'))
      .map((t) => ({ id: t.id, name: t.name || t.englishName || t.id, shortName: t.shortName || '' }))
    if (list.length) {
      write(KEYS.translations, list)
      return list
    }
  } catch {
    /* sin conexión: usa caché */
  }
  return cached?.length ? cached : FALLBACK_TRANSLATIONS
}

/* ---------- Capítulos ---------- */
const chapterMem = new Map()

async function fetchChapter(translation, bookId, chapter, signal) {
  const k = `${translation}/${bookId}/${chapter}`
  if (chapterMem.has(k)) return chapterMem.get(k)
  let res
  try {
    res = await fetch(`${API}/${translation}/${bookId}/${chapter}.json`, { signal })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new BibleError(
      'network',
      navigator.onLine
        ? 'No se pudo contactar el servidor de la Biblia. Revisa tu conexión e inténtalo otra vez.'
        : 'Estás sin conexión y este versículo aún no se descargó. Ábrelo una vez con internet para tenerlo disponible offline.'
    )
  }
  if (res.status === 404) throw new BibleError('not_found', 'Esta versión no incluye ese capítulo.')
  if (!res.ok) throw new BibleError('http', `El servidor respondió con un error (${res.status}).`)
  const json = await res.json()
  chapterMem.set(k, json)
  return json
}

function verseToText(content = []) {
  const parts = []
  for (const piece of content) {
    if (typeof piece === 'string') parts.push(piece)
    else if (piece && typeof piece.text === 'string') parts.push(piece.text)
  }
  return parts.join(' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim()
}

/* ---------- Caché de versículos en localStorage (para offline) ---------- */
function readCache() {
  return read(KEYS.verseCache, {})
}
function writeCache(cache) {
  const keys = Object.keys(cache)
  if (keys.length > 600) {
    keys
      .sort((a, b) => (cache[a].cachedAt || 0) - (cache[b].cachedAt || 0))
      .slice(0, keys.length - 600)
      .forEach((k) => delete cache[k])
  }
  write(KEYS.verseCache, cache)
}

/**
 * Obtiene un pasaje. Primero busca en la caché local; si no está, consulta la API
 * y guarda el resultado.
 */
export async function getPassage(refString, translation, { signal } = {}) {
  const parsed = parseReference(refString)
  if (!parsed) throw new BibleError('bad_ref', `No pude interpretar la cita “${refString}”.`)

  const cacheKey = `${translation}|${parsed.key}`
  const cache = readCache()
  if (cache[cacheKey]) return { ...cache[cacheKey], fromCache: true }

  const json = await fetchChapter(translation, parsed.bookId, parsed.chapter, signal)
  const byNumber = new Map()
  for (const item of json?.chapter?.content ?? []) {
    if (item.type === 'verse') byNumber.set(item.number, verseToText(item.content))
  }
  const wanted = parsed.verses ?? [...byNumber.keys()]
  const verses = wanted.filter((n) => byNumber.get(n)).map((n) => ({ n, text: byNumber.get(n) }))
  if (!verses.length) {
    throw new BibleError('not_found', `No encontré ${parsed.display} en esta versión.`)
  }

  const passage = { reference: parsed.display, translation, verses, cachedAt: Date.now() }
  cache[cacheKey] = passage
  writeCache(cache)
  return { ...passage, fromCache: false }
}

export function passageToText(passage) {
  return passage.verses.length === 1
    ? passage.verses[0].text
    : passage.verses.map((v) => `${v.n} ${v.text}`).join(' ')
}

/** Descarga todos los versículos de las lecciones para usarlos sin conexión. */
export async function prefetchLessons(lessons, translation, onProgress) {
  const refs = [...new Set(lessons.flatMap(collectRefs))]
  let done = 0
  let failed = 0
  for (const ref of refs) {
    try {
      await getPassage(ref, translation)
    } catch {
      failed++
    }
    onProgress?.(++done, refs.length)
  }
  return { total: refs.length, failed }
}
