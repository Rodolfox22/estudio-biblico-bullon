import { useCallback, useEffect, useRef, useState } from 'react'

// Reconocimiento de voz nativo (Chrome, Edge y Safari recientes). Firefox no lo soporta.
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export function useVoice({ onFinal, lang = 'es-AR' }) {
  const [active, setActive] = useState(false) // el usuario activó el micrófono
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const recRef = useRef(null)
  const wantRef = useRef(false)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  const start = useCallback(() => {
    if (!SR || wantRef.current) return
    wantRef.current = true
    setActive(true)
    setError('')

    const rec = new SR()
    rec.lang = lang
    rec.continuous = false // más estable en móviles; se reinicia solo en onend
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let partial = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) {
          const text = r[0].transcript.trim()
          setInterim('')
          if (text) onFinalRef.current?.(text)
        } else partial += r[0].transcript
      }
      if (partial) setInterim(partial)
    }

    rec.onerror = (e) => {
      const fatal = {
        'not-allowed': 'Permiso de micrófono denegado. Habilítalo en la configuración del navegador.',
        'service-not-allowed': 'El navegador no permite el reconocimiento de voz en este contexto.',
        'audio-capture': 'No se detectó ningún micrófono.',
        network: 'El reconocimiento de voz necesita conexión a internet.'
      }[e.error]
      if (fatal) {
        wantRef.current = false
        setActive(false)
        setError(fatal)
      }
    }

    rec.onend = () => {
      setInterim('')
      if (wantRef.current) {
        setTimeout(() => {
          if (wantRef.current) {
            try {
              rec.start()
            } catch {
              /* ya iniciado */
            }
          }
        }, 250)
      } else setActive(false)
    }

    recRef.current = rec
    try {
      rec.start()
    } catch {
      /* ya iniciado */
    }
  }, [lang])

  const stop = useCallback(() => {
    wantRef.current = false
    setActive(false)
    setInterim('')
    try {
      recRef.current?.stop()
    } catch {
      /* noop */
    }
  }, [])

  const toggle = useCallback(() => (wantRef.current ? stop() : start()), [start, stop])

  useEffect(
    () => () => {
      wantRef.current = false
      try {
        recRef.current?.abort()
      } catch {
        /* noop */
      }
    },
    []
  )

  return { supported: !!SR, active, interim, error, toggle, stop }
}
