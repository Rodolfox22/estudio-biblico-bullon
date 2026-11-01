import { useMemo, useState } from 'react'
import { lessons, splitTitle } from '../data/lessons.js'
import { getLessonProgress } from '../lib/storage.js'
import { normalize } from '../lib/text.js'
import { navigate } from '../lib/router.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import DonutProgress from './DonutProgress.jsx'
import LessonImage from './LessonImage.jsx'
import { HeartIcon, SearchIcon } from './Icons.jsx'

export default function Home() {
  const [query, setQuery] = useState('')
  const { favorites } = useFavorites()

  // El progreso se lee de localStorage cada vez que se entra a la portada
  const items = useMemo(() => lessons.map((l) => ({ lesson: l, progress: getLessonProgress(l) })), [])

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return items
    return items.filter(({ lesson }) => normalize([lesson.title, ...(lesson.keywords || [])].join(' ')).includes(q))
  }, [items, query])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold leading-tight">
          <span className="grad-text">Lecciones</span>
        </h2>
        <p className="mt-1 text-muted">Estudia a tu ritmo. Tus respuestas se guardan solas.</p>
      </div>

      <label className="relative mb-5 block">
        <span className="sr-only">Buscar por tema</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por tema o palabra clave"
          className="w-full rounded-full border border-line bg-surface py-3 pl-12 pr-4 text-base placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {filtered.map(({ lesson, progress }) => {
          const { kicker, headline } = splitTitle(lesson.title)
          return (
            <li key={lesson.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <LessonImage src={lesson.image} className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
              <div className="min-w-0 flex-1">
                {kicker && <p className="text-sm text-muted">{kicker}</p>}
                <h3 className="truncate font-serif text-lg font-semibold">{headline}</h3>
                <p className="text-sm text-muted">
                  {progress.answered} de {progress.total} preguntas
                </p>
              </div>
              <DonutProgress pct={progress.pct} />
              <button className="btn-primary" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                Ingresar
              </button>
            </li>
          )
        })}
        {filtered.length === 0 && (
          <li className="p-8 text-center text-muted">
            No hay lecciones con “{query}”. Prueba con otra palabra, por ejemplo “amor” o “salvación”.
          </li>
        )}
      </ul>

      <button
        onClick={() => navigate('/favorites')}
        className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition hover:bg-soft"
      >
        <HeartIcon filled={favorites.length > 0} className="text-accent" />
        <span className="flex-1 font-medium">Versículos favoritos</span>
        <span className="text-sm text-muted">{favorites.length}</span>
      </button>
    </main>
  )
}
