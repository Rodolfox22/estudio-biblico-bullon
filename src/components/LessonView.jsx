import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLesson, splitTitle } from '../data/lessons.js'
import { KEYS, read, write } from '../lib/storage.js'
import { navigate } from '../lib/router.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import QuestionBlock from './QuestionBlock.jsx'
import VerseLink from './VerseLink.jsx'
import LessonImage from './LessonImage.jsx'
import { BackIcon, HeartIcon } from './Icons.jsx'

function SectionTitle({ children }) {
  return <h3 className="grad-text border-b border-line pb-2 font-serif text-xl font-bold leading-snug">{children}</h3>
}

export default function LessonView({ lessonId }) {
  const lesson = getLesson(lessonId)
  const { isFavorite, isBusy, toggle } = useFavorites()

  const [answers, setAnswers] = useState(() => (lesson ? read(KEYS.responses(lesson.id), {}) : {}))
  const [status, setStatus] = useState({}) // questionId -> 'saving' | 'saved'
  const [decided, setDecided] = useState(() => (lesson ? !!read(KEYS.decision(lesson.id), false) : false))
  const timers = useRef({})
  const latest = useRef(answers)
  latest.current = answers

  useEffect(() => {
    setAnswers(lesson ? read(KEYS.responses(lesson.id), {}) : {})
    setDecided(lesson ? !!read(KEYS.decision(lesson.id), false) : false)
    setStatus({})
  }, [lesson?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Guardado automático con pequeña espera (debounce) para no escribir en cada tecla
  const handleChange = useCallback(
    (qid, text) => {
      setAnswers((a) => ({ ...a, [qid]: text }))
      setStatus((s) => ({ ...s, [qid]: 'saving' }))
      clearTimeout(timers.current[qid])
      timers.current[qid] = setTimeout(() => {
        write(KEYS.responses(lesson.id), { ...latest.current, [qid]: text })
        setStatus((s) => ({ ...s, [qid]: 'saved' }))
      }, 400)
    },
    [lesson?.id]
  )

  // Si el usuario sale de la pantalla antes del debounce, guarda lo pendiente
  useEffect(
    () => () => {
      if (lesson && Object.values(timers.current).length) write(KEYS.responses(lesson.id), latest.current)
      Object.values(timers.current).forEach(clearTimeout)
    },
    [lesson?.id] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const progress = useMemo(() => {
    if (!lesson) return { answered: 0, total: 0 }
    const ids = lesson.sections.flatMap((s) => s.questions.map((q) => q.id))
    return { answered: ids.filter((id) => (answers[id] || '').trim()).length, total: ids.length }
  }, [lesson, answers])

  if (!lesson) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="mb-4 text-lg">No encontré esa lección.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Volver a la portada
        </button>
      </main>
    )
  }

  const { kicker, headline } = splitTitle(lesson.title)
  let counter = 0

  return (
    <main className="pb-40">
      <section className="grad-banner relative overflow-hidden text-white">
        <LessonImage src={lesson.image} className="absolute inset-0 h-full w-full opacity-30 mix-blend-luminosity" />
        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-7">
          {kicker && <p className="text-sm text-white/80">{kicker}</p>}
          <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">{headline}</h2>
          <p className="mt-3 text-sm text-white/85">
            {progress.answered} de {progress.total} preguntas respondidas
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4">
        <button className="btn-ghost mt-5" onClick={() => navigate('/')}>
          <BackIcon width={18} height={18} /> Volver a la portada
        </button>

        {lesson.sections.map((section) => (
          <section key={section.title} className="mt-8">
            <SectionTitle>{section.title}</SectionTitle>
            <div className="divide-y divide-line">
              {section.questions.map((q) => {
                counter += 1
                return (
                  <QuestionBlock
                    key={q.id}
                    number={counter}
                    question={q}
                    value={answers[q.id] || ''}
                    status={status[q.id]}
                    onChange={handleChange}
                  />
                )
              })}
            </div>
          </section>
        ))}

        <section className="mt-10">
          <SectionTitle>Versículos para meditar</SectionTitle>
          <ul className="divide-y divide-line">
            {lesson.versesSection.map((ref) => (
              <li key={ref} className="flex items-center justify-between py-3">
                <VerseLink reference={ref} />
                <button
                  className="icon-btn"
                  disabled={isBusy(ref)}
                  onClick={() => toggle(ref)}
                  aria-pressed={isFavorite(ref)}
                  aria-label={isFavorite(ref) ? `Quitar ${ref} de favoritos` : `Agregar ${ref} a favoritos`}
                >
                  <HeartIcon filled={isFavorite(ref)} className={isFavorite(ref) ? 'text-accent' : 'text-muted'} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-line bg-soft p-5">
          <p className="font-serif text-lg italic leading-8">{lesson.decision.text}</p>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={decided}
              onChange={(e) => {
                setDecided(e.target.checked)
                write(KEYS.decision(lesson.id), e.target.checked)
              }}
              className="h-6 w-6 shrink-0 cursor-pointer accent-[rgb(var(--accent))]"
            />
            <span className="font-medium">{lesson.decision.checkboxLabel}</span>
          </label>
        </section>

        <button className="btn-primary mt-10" onClick={() => navigate('/')}>
          <BackIcon width={18} height={18} /> Volver a la portada
        </button>
      </div>
    </main>
  )
}
