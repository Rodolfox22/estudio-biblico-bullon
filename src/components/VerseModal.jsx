import { useEffect, useRef, useState } from 'react'
import { getPassage, DEFAULT_TRANSLATION } from '../lib/bible.js'
import { useSettings } from '../context/SettingsContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { CloseIcon, HeartIcon } from './Icons.jsx'

export default function VerseModal({ reference, onClose }) {
  const { settings, translationName } = useSettings()
  const { isFavorite, isBusy, toggle } = useFavorites()
  const [state, setState] = useState({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const closeRef = useRef(null)

  useEffect(() => {
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    getPassage(reference, settings.translation, { signal: ctrl.signal })
      .then((passage) => setState({ status: 'ok', passage }))
      .catch((error) => error.name !== 'AbortError' && setState({ status: 'error', error }))
    return () => ctrl.abort()
  }, [reference, settings.translation, attempt])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const shownRef = state.passage?.reference || reference
  const fav = isFavorite(shownRef)
  const closest = settings.translation === DEFAULT_TRANSLATION

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Versículo ${shownRef}`}
        className="pop-in flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="grad-banner flex items-center gap-2 px-5 py-4 text-white">
          <h2 className="flex-1 font-serif text-xl font-semibold">{shownRef}</h2>
          <button
            className="icon-btn !text-white hover:!bg-white/15"
            disabled={isBusy(shownRef)}
            onClick={() => toggle(shownRef, state.passage)}
            aria-pressed={fav}
            aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <HeartIcon filled={fav} />
          </button>
          <button ref={closeRef} className="icon-btn !text-white hover:!bg-white/15" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {state.status === 'loading' && <p className="py-8 text-center text-muted">Buscando versículo…</p>}

          {state.status === 'error' && (
            <div className="py-4 text-center">
              <p className="mb-4 text-ink">{state.error.message}</p>
              {state.error.code !== 'bad_ref' && (
                <button className="btn-primary" onClick={() => setAttempt((n) => n + 1)}>
                  Reintentar
                </button>
              )}
            </div>
          )}

          {state.status === 'ok' && (
            <>
              <blockquote className="space-y-3 font-serif text-[1.15rem] leading-8">
                {state.passage.verses.map((v) => (
                  <p key={v.n}>
                    {state.passage.verses.length > 1 && (
                      <sup className="mr-1.5 font-sans text-xs font-semibold text-accent">{v.n}</sup>
                    )}
                    {v.text}
                  </p>
                ))}
              </blockquote>
              <p className="mt-5 border-t border-line pt-3 text-sm text-muted">
                {translationName(settings.translation)}
                {state.passage.fromCache && ' · guardado en este dispositivo'}
              </p>
              {closest && (
                <p className="mt-1 text-xs text-muted">
                  La RVR1960 tiene derechos de autor y no está en la API gratuita; se muestra la Reina-Valera 1909, la más cercana.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
