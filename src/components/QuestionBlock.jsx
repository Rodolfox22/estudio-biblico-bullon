import { useEffect, useRef } from 'react'
import VerseLink from './VerseLink.jsx'

export default function QuestionBlock({ number, question, value, status, onChange }) {
  const ref = useRef(null)

  // Crece con el texto
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 2 + 'px'
  }, [value])

  return (
    <div className="border-b border-line/60 py-5">
      <p className="font-serif text-[1.05rem] leading-7">
        <span className="mr-2 font-semibold text-accent">{number}.</span>
        {question.text}
      </p>
      {question.bibleRefs?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {question.bibleRefs.map((r) => (
            <VerseLink key={r} reference={r} />
          ))}
        </div>
      )}
      <div className="relative mt-3">
        <label htmlFor={question.id} className="sr-only">
          Tu respuesta a: {question.text}
        </label>
        <textarea
          id={question.id}
          ref={ref}
          data-question-field
          rows={3}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder="Escribe tu respuesta aquí o dicta con el micrófono…"
          className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 font-serif text-base leading-7 placeholder:font-sans placeholder:text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <span className="pointer-events-none absolute -bottom-5 right-1 text-xs text-muted" aria-live="polite">
          {status === 'saving' ? 'Guardando…' : status === 'saved' ? 'Guardado ✓' : ''}
        </span>
      </div>
    </div>
  )
}
