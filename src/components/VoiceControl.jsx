import { useCallback } from 'react'
import { lessons } from '../data/lessons.js'
import { navigate } from '../lib/router.js'
import { parseReference } from '../lib/reference.js'
import { useToast } from '../context/ToastContext.jsx'
import { useVerse } from '../context/VerseContext.jsx'
import { matchCommand, resolveLesson } from '../voice/commands.js'
import { getTargetField, insertAtCursor } from '../voice/fieldTracker.js'
import { useVoice } from '../voice/useVoice.js'
import { MicIcon } from './Icons.jsx'

function focusQuestion(direction, toast) {
  const fields = [...document.querySelectorAll('[data-question-field]')]
  if (!fields.length) return toast('Abre una lección para moverte entre preguntas.')
  const current = fields.indexOf(getTargetField())
  const next = current === -1 ? (direction > 0 ? 0 : fields.length - 1) : current + direction
  if (next < 0 || next >= fields.length) {
    return toast(direction > 0 ? 'Esa es la última pregunta.' : 'Esa es la primera pregunta.')
  }
  fields[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
  fields[next].focus({ preventScroll: true })
}

export default function VoiceControl() {
  const toast = useToast()
  const verse = useVerse()

  const handleFinal = useCallback(
    (text) => {
      const cmd = matchCommand(text)
      if (cmd) {
        switch (cmd.name) {
          case 'next':
            return focusQuestion(1, toast)
          case 'prev':
            return focusQuestion(-1, toast)
          case 'home':
            verse.close()
            return navigate('/')
          case 'favorites':
            verse.close()
            return navigate('/favorites')
          case 'closeVerse':
            return verse.close()
          case 'goLesson': {
            const lesson = resolveLesson(cmd.query, lessons)
            if (!lesson) return toast(`No encontré la lección “${cmd.query}”.`)
            verse.close()
            return navigate(`/lesson/${lesson.id}`)
          }
          case 'openVerse': {
            const parsed = parseReference(cmd.ref)
            if (!parsed) return toast(`No entendí la cita “${cmd.ref}”. Prueba: “abrir versículo Juan 3:16”.`)
            return verse.open(parsed.display)
          }
          default:
        }
      }

      // Si no es un comando, se dicta en el campo de texto activo
      const field = getTargetField()
      if (field) return insertAtCursor(field, text)
      toast(`No hay un campo seleccionado. Toca una respuesta para dictar. Escuché: “${text}”`)
    },
    [toast, verse]
  )

  const { supported, active, interim, error, toggle } = useVoice({ onFinal: handleFinal, lang: 'es-AR' })

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-end gap-2 px-4" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
      {(active || error) && (
        <div role="status" className="pop-in pointer-events-auto max-w-[min(100%,22rem)] rounded-2xl bg-ink px-4 py-3 text-sm text-bg shadow-xl">
          {error ? (
            <span>{error}</span>
          ) : (
            <span className="flex items-center gap-3">
              <span className="wave text-bg" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </span>
              <span className="min-w-0 truncate">{interim || 'Te escucho…'}</span>
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        // Evita que el botón le quite el foco al campo de texto: el dictado sigue yendo ahí
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        onClick={() => (supported ? toggle() : toast('Tu navegador no admite reconocimiento de voz. Prueba con Chrome o Edge.'))}
        aria-pressed={active}
        aria-label={active ? 'Detener micrófono' : 'Activar micrófono'}
        className={`pointer-events-auto grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition active:scale-95 ${
          supported ? 'grad-banner' : 'bg-muted'
        } ${active ? 'mic-active' : ''}`}
      >
        <MicIcon width={26} height={26} />
      </button>
    </div>
  )
}
