import { useEffect, useState } from 'react'
import { THEMES, useSettings } from '../context/SettingsContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { lessons } from '../data/lessons.js'
import { DEFAULT_TRANSLATION, prefetchLessons } from '../lib/bible.js'
import { useInstallPrompt } from '../lib/hooks.js'
import { KEYS } from '../lib/storage.js'
import { CloseIcon, DownloadIcon, TrashIcon } from './Icons.jsx'

const STORAGE_PREFIX = 'bible_study_'
// Cachés de datos que crea el service worker (los de la app misma se conservan al borrar solo la caché)
const DATA_CACHES = ['bible-api', 'lesson-images']

/** Borra versículos guardados (localStorage) y las cachés de datos del navegador. Conserva respuestas, favoritos y ajustes. */
async function clearCacheOnly() {
  localStorage.removeItem(KEYS.verseCache)
  if ('caches' in window) {
    await Promise.all(DATA_CACHES.map((name) => caches.delete(name)))
  }
}

/** Borra TODO: respuestas, decisiones, favoritos, ajustes, versículos, cachés y service worker. */
async function clearEverything() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => localStorage.removeItem(k))

  if ('caches' in window) {
    const names = await caches.keys()
    await Promise.all(names.map((n) => caches.delete(n)))
  }
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(regs.map((r) => r.unregister()))
  }
}

const CONFIRM_TEXT = {
  cache: {
    title: '¿Borrar la caché?',
    body: 'Se eliminarán los versículos descargados y las imágenes guardadas. Tus respuestas, decisiones, favoritos y ajustes se conservan. Los versículos se volverán a descargar al abrirlos con conexión. La app se recargará.',
    action: 'Sí, borrar caché'
  },
  all: {
    title: '¿Borrar todos los datos?',
    body: 'Se eliminarán de forma permanente tus respuestas, decisiones, favoritos, ajustes, versículos descargados y la caché. Esta acción no se puede deshacer. La app se recargará y necesitarás conexión a internet para volver a abrirla.',
    action: 'Sí, borrar todo'
  }
}

export default function SettingsPanel({ onClose }) {
  const { settings, update, translations } = useSettings()
  const toast = useToast()
  const { canInstall, install } = useInstallPrompt()
  const [progress, setProgress] = useState(null)
  const [confirm, setConfirm] = useState(null) // null | 'cache' | 'all'
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const downloadOffline = async () => {
    setProgress({ done: 0, total: 1 })
    const result = await prefetchLessons(lessons, settings.translation, (done, total) => setProgress({ done, total }))
    setProgress(null)
    toast(
      result.failed
        ? `Se descargaron ${result.total - result.failed} de ${result.total} citas. Revisa tu conexión y reintenta.`
        : 'Listo: los versículos de las lecciones están disponibles sin conexión.'
    )
  }

  const runClear = async () => {
    if (!confirm) return
    setClearing(true)
    try {
      if (confirm === 'all') await clearEverything()
      else await clearCacheOnly()
      window.location.hash = '#/'
      window.location.reload()
    } catch {
      setClearing(false)
      setConfirm(null)
      toast('No se pudo borrar. Cierra otras pestañas de la app e inténtalo de nuevo.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" aria-label="Configuración" className="pop-in flex h-full w-full max-w-sm flex-col overflow-y-auto bg-surface shadow-2xl">
        <div className="grad-banner flex items-center px-5 py-4 text-white" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <h2 className="flex-1 font-serif text-xl font-semibold">Configuración</h2>
          <button className="icon-btn !text-white hover:!bg-white/15" onClick={onClose} aria-label="Cerrar configuración">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-7 p-5">
          <section>
            <label htmlFor="translation" className="mb-2 block font-semibold">Versión de la Biblia</label>
            <select
              id="translation"
              value={settings.translation}
              onChange={(e) => update({ translation: e.target.value })}
              className="w-full rounded-xl border border-line bg-surface px-3 py-3 focus:border-accent focus:outline-none"
            >
              {!translations.some((t) => t.id === settings.translation) && (
                <option value={settings.translation}>{settings.translation}</option>
              )}
              {translations.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {settings.translation === DEFAULT_TRANSLATION && (
              <p className="mt-2 text-xs text-muted">
                La RVR1960 tiene derechos de autor y no está disponible en la API gratuita. Se usa la Reina-Valera 1909.
              </p>
            )}
          </section>

          <section>
            <p className="mb-2 font-semibold">Tema de color</p>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ theme: t.id, ...(t.id === 'oscuro' ? { dark: true } : {}) })}
                  aria-pressed={settings.theme === t.id}
                  className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                    settings.theme === t.id ? 'border-accent bg-soft' : 'border-line hover:bg-soft'
                  }`}
                >
                  <span className="mb-2 block h-8 rounded-lg" style={{ backgroundImage: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }} />
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="fontScale" className="mb-2 flex items-baseline justify-between font-semibold">
              Tamaño de letra <span className="text-sm font-normal text-muted">{Math.round(settings.fontScale * 100)}%</span>
            </label>
            <input
              id="fontScale"
              type="range"
              min="0.85"
              max="1.4"
              step="0.05"
              value={settings.fontScale}
              onChange={(e) => update({ fontScale: parseFloat(e.target.value) })}
              className="w-full accent-[rgb(var(--accent))]"
            />
            <p className="mt-2 font-serif italic text-muted">“Porque de tal manera amó Dios al mundo…”</p>
          </section>

          <section className="flex items-center justify-between">
            <label htmlFor="dark" className="font-semibold">Modo oscuro</label>
            <input id="dark" type="checkbox" role="switch" checked={settings.dark} onChange={(e) => update({ dark: e.target.checked })} className="h-6 w-11 cursor-pointer accent-[rgb(var(--accent))]" />
          </section>

          <section className="border-t border-line pt-6">
            <p className="mb-1 font-semibold">Uso sin conexión</p>
            <p className="mb-3 text-sm text-muted">
              Descarga todas las citas de las lecciones en esta versión para leerlas sin internet.
            </p>
            <button className="btn-ghost w-full" onClick={downloadOffline} disabled={!!progress}>
              <DownloadIcon width={18} height={18} />
              {progress ? `Descargando ${progress.done}/${progress.total}…` : 'Descargar versículos'}
            </button>
            {canInstall && (
              <button className="btn-primary mt-3 w-full" onClick={install}>
                Instalar aplicación
              </button>
            )}
          </section>

          <section className="border-t border-line pt-6">
            <p className="mb-1 font-semibold">Datos y almacenamiento</p>
            <p className="mb-3 text-sm text-muted">
              Libera espacio o empieza de cero. Tus datos viven solo en este dispositivo.
            </p>

            <div className="space-y-2">
              <button className="btn-ghost w-full" onClick={() => setConfirm('cache')} disabled={clearing}>
                <TrashIcon width={18} height={18} />
                Borrar caché
              </button>
              <button
                className="btn w-full border border-red-500/50 bg-surface text-red-600 hover:bg-red-500/10 dark:text-red-400"
                onClick={() => setConfirm('all')}
                disabled={clearing}
              >
                <TrashIcon width={18} height={18} />
                Borrar todos los datos
              </button>
            </div>

            {confirm && (
              <div role="alert" className="pop-in mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                <p className="font-semibold">{CONFIRM_TEXT[confirm].title}</p>
                <p className="mt-1 text-sm leading-6">{CONFIRM_TEXT[confirm].body}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-ghost flex-1" onClick={() => setConfirm(null)} disabled={clearing}>
                    Cancelar
                  </button>
                  <button className="btn flex-1 bg-red-600 text-white hover:bg-red-700" onClick={runClear} disabled={clearing}>
                    {clearing ? 'Borrando…' : CONFIRM_TEXT[confirm].action}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}
