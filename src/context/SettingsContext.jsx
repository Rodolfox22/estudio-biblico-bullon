import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../lib/hooks.js'
import { KEYS } from '../lib/storage.js'
import { DEFAULT_TRANSLATION, FALLBACK_TRANSLATIONS, loadSpanishTranslations } from '../lib/bible.js'

const DEFAULTS = { translation: DEFAULT_TRANSLATION, theme: 'clasico', dark: false, fontScale: 1 }

export const THEMES = [
  { id: 'clasico', label: 'Clásico Azul', swatch: ['#1e4fa3', '#3b82f6'] },
  { id: 'tierra', label: 'Tierra', swatch: ['#8a4c22', '#c48246'] },
  { id: 'oscuro', label: 'Oscuro Elegante', swatch: ['#1e1b4b', '#d4af37'] }
]

const SettingsContext = createContext(null)
export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(KEYS.config, DEFAULTS)
  const [translations, setTranslations] = useState(FALLBACK_TRANSLATIONS)

  const cfg = { ...DEFAULTS, ...settings }

  // Aplica tema, modo oscuro y tamaño de letra al documento
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = cfg.theme
    root.classList.toggle('dark', !!cfg.dark)
    root.style.setProperty('--fs', String(cfg.fontScale))
    const p1 = getComputedStyle(root).getPropertyValue('--p1').trim().split(/\s+/).join(',')
    if (p1) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${p1})`)
  }, [cfg.theme, cfg.dark, cfg.fontScale])

  // Versiones en español disponibles (con caché para offline)
  useEffect(() => {
    let alive = true
    loadSpanishTranslations().then((list) => alive && setTranslations(list))
    return () => {
      alive = false
    }
  }, [])

  const update = useCallback((patch) => setSettings((s) => ({ ...DEFAULTS, ...s, ...patch })), [setSettings])

  const translationName = useCallback(
    (id) => translations.find((t) => t.id === id)?.name || id,
    [translations]
  )

  const value = useMemo(
    () => ({ settings: cfg, update, translations, translationName }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.translation, cfg.theme, cfg.dark, cfg.fontScale, translations, update, translationName]
  )
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
