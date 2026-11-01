import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLesson, splitTitle } from '../data/lessons.js'
import { getQuestions } from '../lib/lessonUtils.js'
import { KEYS, read, write } from '../lib/storage.js'
import { navigate } from '../lib/router.js'
import Block from './LessonBlocks.jsx'
import LessonImage from './LessonImage.jsx'
import { BackIcon } from './Icons.jsx'

export default function LessonView({ lessonId }) {
  const lesson = getLesson(lessonId)

  const [answers, setAnswers] = useState(() => (lesson ? read(KEYS.responses(lesson.id), {}) : {}))
  const [status, setStatus] = useState({}) // questionId -> 'saving' | 'saved'
  const timers = useRef({})
  const latest = useRef(answers)
  latest.current = answers

  useEffect(() => {
    setAnswers(lesson ? read(KEYS.responses(lesson.id), {}) : {})
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

  const questions = useMemo(() => (lesson ? getQuestions(lesson) : []), [lesson])
  const numbers = useMemo(() => new Map(questions.map((q, i) => [q.id, i + 1])), [questions])
  const answered = questions.filter((q) => (answers[q.id] || '').trim()).length

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

  return (
    <main className="pb-40">
      <section className="grad-banner relative overflow-hidden text-white">
        <LessonImage src={lesson.image} className="absolute inset-0 h-full w-full opacity-30 mix-blend-luminosity" />
        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-7">
          {kicker && <p className="text-sm text-white/80">{kicker}</p>}
          <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">{headline}</h2>
          {questions.length > 0 && (
            <p className="mt-3 text-sm text-white/85">
              {answered} de {questions.length} preguntas respondidas
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4">
        <button className="btn-ghost mt-5" onClick={() => navigate('/')}>
          <BackIcon width={18} height={18} /> Volver a la portada
        </button>

        {lesson.blocks.map((block, i) => (
          <Block
            key={block.type === 'question' ? block.id : `${block.type}-${i}`}
            block={block}
            lessonId={lesson.id}
            number={numbers.get(block.id)}
            answers={answers}
            status={status}
            onAnswer={handleChange}
          />
        ))}

        <button className="btn-primary mt-10" onClick={() => navigate('/')}>
          <BackIcon width={18} height={18} /> Volver a la portada
        </button>
      </div>
    </main>
  )
}
