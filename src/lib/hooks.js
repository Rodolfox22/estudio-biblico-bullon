import { useEffect, useState } from 'react'
import { read, write } from './storage.js'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => read(key, typeof initial === 'function' ? initial() : initial))
  useEffect(() => {
    write(key, value)
  }, [key, value])
  return [value, setValue]
}

export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export function useInstallPrompt() {
  const [event, setEvent] = useState(null)
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setEvent(e)
    }
    const onInstalled = () => setEvent(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  const install = async () => {
    if (!event) return
    event.prompt()
    await event.userChoice
    setEvent(null)
  }
  return { canInstall: !!event, install }
}
