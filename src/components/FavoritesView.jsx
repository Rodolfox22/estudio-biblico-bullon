import { useFavorites } from '../context/FavoritesContext.jsx'
import { useVerse } from '../context/VerseContext.jsx'
import { navigate } from '../lib/router.js'
import { HeartIcon, TrashIcon } from './Icons.jsx'

export default function FavoritesView() {
  const { favorites, remove } = useFavorites()
  const { open } = useVerse()

  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <h2 className="grad-text mb-1 font-serif text-3xl font-bold">Favoritos</h2>
      <p className="mb-6 text-muted">Tus versículos guardados, disponibles también sin conexión.</p>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <HeartIcon className="mx-auto mb-3 text-muted" width={32} height={32} />
          <p className="mb-4">Aún no marcaste versículos. Toca el corazón junto a una cita para guardarla aquí.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Ir a las lecciones
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((f) => (
            <li key={f.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start gap-2">
                <button className="verse-link flex-1 text-left text-lg font-semibold" onClick={() => open(f.reference)}>
                  {f.reference}
                </button>
                <button className="icon-btn -mr-2 -mt-2 text-muted" onClick={() => remove(f.id)} aria-label={`Quitar ${f.reference} de favoritos`}>
                  <TrashIcon />
                </button>
              </div>
              <p className="mt-2 font-serif text-[1.05rem] leading-8">{f.text}</p>
              <p className="mt-3 text-xs text-muted">{f.translationName}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
