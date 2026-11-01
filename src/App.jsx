import { useState } from 'react'
import { matchRoute, useRoute } from './lib/router.js'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { VerseProvider } from './context/VerseContext.jsx'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import LessonView from './components/LessonView.jsx'
import FavoritesView from './components/FavoritesView.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import VoiceControl from './components/VoiceControl.jsx'

function Shell() {
  const route = matchRoute(useRoute())
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Header showBack={route.name !== 'home'} onOpenSettings={() => setSettingsOpen(true)} />
      {route.name === 'home' && <Home />}
      {route.name === 'lesson' && <LessonView key={route.id} lessonId={route.id} />}
      {route.name === 'favorites' && <FavoritesView />}
      <VoiceControl />
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <FavoritesProvider>
          <VerseProvider>
            <Shell />
          </VerseProvider>
        </FavoritesProvider>
      </ToastProvider>
    </SettingsProvider>
  )
}
