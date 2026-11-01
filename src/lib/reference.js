import { findBook } from '../data/books.js'
import { normalize, wordsToDigits } from './text.js'

/**
 * Interpreta citas en español: "1 Juan 4:8", "Génesis 3:8-10", "Lam. 3:22-23",
 * "Romanos 8:38,39", "juan 3 16" (voz), "Judas 3".
 * Devuelve { bookId, bookName, chapter, verses: number[] | null, display, key } o null.
 */
export function parseReference(input) {
  if (!input) return null
  let s = wordsToDigits(input)
    .replace(/([a-z])\./g, '$1') // "lam." -> "lam"
    .replace(/\b(capitulo|cap|versiculos?|vers|verso|versos)\b/g, ' ')
    .replace(/(\d)\s+(?:al|a|hasta)\s+(\d)/g, '$1-$2')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim()

  const withVerses = s.match(/^(.*?[a-z])\s*(\d+)(?:\s*[:.,]\s*|\s+)([\d,\-]+)$/)
  const chapterOnly = s.match(/^(.*?[a-z])\s*(\d+)$/)
  const m = withVerses || chapterOnly
  if (!m) return null

  const book = findBook(m[1].trim().replace(/\s+/g, ' '))
  if (!book) return null

  let chapter = parseInt(m[2], 10)
  let versesStr = withVerses ? m[3] : null

  // Libros de un solo capítulo: "Judas 3" significa versículo 3
  if (book.single && !withVerses) {
    versesStr = String(chapter)
    chapter = 1
  }

  let verses = null
  if (versesStr) {
    verses = []
    for (const part of versesStr.split(',')) {
      if (!part) continue
      const [a, b] = part.split('-').map((n) => parseInt(n, 10))
      if (Number.isNaN(a)) continue
      const end = Number.isNaN(b) || b == null ? a : b
      for (let n = a; n <= Math.min(end, a + 200); n++) verses.push(n)
    }
    if (!verses.length) verses = null
  }

  const spec = versesStr ? versesStr.replace(/,/g, ', ') : ''
  const display = `${book.name} ${book.single && spec ? '' : chapter}${spec ? (book.single ? spec : ':' + spec) : ''}`.replace(/\s+$/, '')
  return {
    bookId: book.id,
    bookName: book.name,
    chapter,
    verses,
    display,
    key: `${book.id}.${chapter}.${versesStr || 'all'}`
  }
}

export const canonicalRef = (ref) => parseReference(ref)?.display ?? ref

export { normalize }
