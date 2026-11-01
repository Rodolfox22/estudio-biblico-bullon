import { createContext, useCallback, useContext, useState } from 'react'
import { useLocalStorage } from '../lib/hooks.js'
import { KEYS } from '../lib/storage.js'
import { getPassage, passageToText } from '../lib/bible.js'
import { canonicalRef } from '../lib/reference.js'
import { useSettings } from './SettingsContext.jsx'
import { useToast } from './ToastContext.jsx'

const FavoritesContext = createContext(null)
export const useFavorites = () => useContext(FavoritesContext)

export function FavoritesProvider({ children }) {
  const { settings, translationName } = useSettings()
  const toast = useToast()
  const [favorites, setFavorites] = useLocalStorage(KEYS.favorites, [])
  const [busy, setBusy] = useState(() => new Set())

  const idFor = useCallback((ref) => `${settings.translation}|${canonicalRef(ref)}`, [settings.translation])
  const isFavorite = useCallback((ref) => favorites.some((f) => f.id === idFor(ref)), [favorites, idFor])
  const isBusy = useCallback((ref) => busy.has(idFor(ref)), [busy, idFor])

  const toggle = useCallback(
    async (ref, knownPassage) => {
      const id = idFor(ref)
      if (favorites.some((f) => f.id === id)) {
        setFavorites((fs) => fs.filter((f) => f.id !== id))
        return
      }
      setBusy((b) => new Set(b).add(id))
      try {
        // El texto se guarda al marcar, para poder leerlo después sin conexión
        const passage = knownPassage ?? (await getPassage(ref, settings.translation))
        setFavorites((fs) => [
          {
            id,
            reference: passage.reference,
            translation: settings.translation,
            translationName: translationName(settings.translation),
            text: passageToText(passage),
            savedAt: Date.now()
          },
          ...fs.filter((f) => f.id !== id)
        ])
        toast('Guardado en favoritos')
      } catch (e) {
        toast(e.message || 'No se pudo guardar el favorito.')
      } finally {
        setBusy((b) => {
          const n = new Set(b)
          n.delete(id)
          return n
        })
      }
    },
    [favorites, idFor, setFavorites, settings.translation, translationName, toast]
  )

  const remove = useCallback((id) => setFavorites((fs) => fs.filter((f) => f.id !== id)), [setFavorites])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, isBusy, toggle, remove }}>
      {children}
    </FavoritesContext.Provider>
  )
}
