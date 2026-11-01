import { useEffect, useState } from 'react'
import { THEMES, useSettings } from '../context/SettingsContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { lessons } from '../data/lessons.js'
import { DEFAULT_TRANSLATION, prefetchLessons } from '../lib/bible.js'
import { useInstallPrompt } from '../lib/hooks.js'
import { CloseIcon, DownloadIcon } from './Icons.jsx'

export default function SettingsPanel({ onClose }) {
  const { settings, update, translations } = useSettings()
  const toast = useToast()
  const { canInstall, install } = useInstallPrompt()
  const [progress, setProgress] = useState(null)

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
        </div>
      </aside>
    </div>
  )
}
