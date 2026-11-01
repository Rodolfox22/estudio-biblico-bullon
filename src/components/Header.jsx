import { useSettings } from '../context/SettingsContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useInstallPrompt, useOnline } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { BackIcon, BookIcon, DownloadIcon, GearIcon, HeartIcon, MoonIcon, SunIcon } from './Icons.jsx'

export default function Header({ showBack, onOpenSettings }) {
  const { settings, update } = useSettings()
  const { favorites } = useFavorites()
  const online = useOnline()
  const { canInstall, install } = useInstallPrompt()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-3">
        {showBack ? (
          <button className="icon-btn" onClick={() => navigate('/')} aria-label="Volver a la portada">
            <BackIcon />
          </button>
        ) : (
          <BookIcon className="mx-2 text-accent" />
        )}
        <h1 className="grad-text flex-1 truncate font-serif text-xl font-bold">Estudio Bíblico</h1>

        {!online && (
          <span className="mr-1 rounded-full bg-soft px-2 py-1 text-xs font-medium text-muted" title="Puedes seguir estudiando; los versículos descargados están disponibles.">
            Sin conexión
          </span>
        )}
        {canInstall && (
          <button className="icon-btn" onClick={install} aria-label="Instalar aplicación" title="Instalar aplicación">
            <DownloadIcon />
          </button>
        )}
        <button className="icon-btn relative" onClick={() => navigate('/favorites')} aria-label={`Favoritos (${favorites.length})`}>
          <HeartIcon filled={favorites.length > 0} className={favorites.length ? 'text-accent' : ''} />
        </button>
        <button
          className="icon-btn"
          onClick={() => update({ dark: !settings.dark })}
          aria-label={settings.dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {settings.dark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Configuración">
          <GearIcon />
        </button>
      </div>
    </header>
  )
}
