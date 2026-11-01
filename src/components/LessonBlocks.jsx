import { useState } from 'react'
import { KEYS, read, write } from '../lib/storage.js'
import { asArray } from '../lib/lessonUtils.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useVerse } from '../context/VerseContext.jsx'
import LessonImage from './LessonImage.jsx'
import QuestionBlock from './QuestionBlock.jsx'
import VerseLink from './VerseLink.jsx'
import { HeartIcon } from './Icons.jsx'

/* Texto con **negrita** y *cursiva* */
function Rich({ children }) {
  const parts = String(children).split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('*') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : p
  )
}

function RefLinks({ refs, light = false }) {
  const { open } = useVerse()
  if (!refs.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((r) =>
        light ? (
          <button
            key={r}
            type="button"
            onClick={() => open(r)}
            className="rounded-full bg-white/15 px-3 py-1 font-serif text-sm italic text-white underline decoration-white/40 underline-offset-4 transition hover:bg-white/25"
          >
            {r}
          </button>
        ) : (
          <VerseLink key={r} reference={r} />
        )
      )}
    </div>
  )
}

/* ---------- Bloques ---------- */

function SectionBlock({ block }) {
  return (
    <h3 className="grad-text mt-10 border-b border-line pb-2 font-serif text-xl font-bold leading-snug">{block.title}</h3>
  )
}

function TextBlock({ block }) {
  const style = block.style || 'normal'
  const cls = {
    normal: 'font-serif text-[1.05rem] leading-8',
    lead: 'font-serif text-xl leading-9',
    quote: 'border-l-4 border-accent/50 pl-4 font-serif text-[1.1rem] italic leading-8 text-ink/90'
  }[style]
  return (
    <div className="mt-5 space-y-4">
      {block.title && <h4 className="font-semibold">{block.title}</h4>}
      {asArray(block.content).map((p, i) => (
        <p key={i} className={cls}>
          <Rich>{p}</Rich>
        </p>
      ))}
      {block.cite && <p className="text-sm text-muted">— {block.cite}</p>}
    </div>
  )
}

function ListBlock({ block }) {
  const Tag = block.ordered ? 'ol' : 'ul'
  return (
    <Tag className={`mt-5 space-y-2 pl-6 font-serif text-[1.05rem] leading-8 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-accent`}>
      {asArray(block.items).map((it, i) => (
        <li key={i}>
          <Rich>{it}</Rich>
        </li>
      ))}
    </Tag>
  )
}

function CalloutBlock({ block }) {
  return (
    <aside className="mt-6 rounded-2xl border border-line bg-soft p-5">
      {block.title && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{block.title}</p>}
      {asArray(block.text).map((p, i) => (
        <p key={i} className="font-serif text-lg italic leading-8 [&:not(:first-of-type)]:mt-3">
          <Rich>{p}</Rich>
        </p>
      ))}
      {asArray(block.refs).length > 0 && (
        <div className="mt-3">
          <RefLinks refs={asArray(block.refs)} />
        </div>
      )}
    </aside>
  )
}

/* Banner de color con versículos intermedios y un texto de declaración */
function BannerBlock({ block }) {
  return (
    <section className="grad-banner relative mt-8 overflow-hidden rounded-2xl p-5 text-white shadow-sm">
      {block.image && <LessonImage src={block.image} className="absolute inset-0 h-full w-full opacity-25 mix-blend-luminosity" />}
      <div className="relative space-y-3">
        {block.title && <h3 className="font-serif text-xl font-bold leading-snug">{block.title}</h3>}
        <RefLinks refs={asArray(block.refs)} light />
        {asArray(block.text).map((p, i) => (
          <p key={i} className="font-serif text-[1.05rem] italic leading-8 text-white/95">
            <Rich>{p}</Rich>
          </p>
        ))}
      </div>
    </section>
  )
}

function VersesBlock({ block }) {
  const { isFavorite, isBusy, toggle } = useFavorites()
  const withHeart = block.favorites !== false
  return (
    <div className="mt-5">
      {block.title && <h4 className="mb-1 font-semibold">{block.title}</h4>}
      <ul className="divide-y divide-line">
        {asArray(block.refs).map((ref) => (
          <li key={ref} className="flex items-center justify-between py-3">
            <VerseLink reference={ref} />
            {withHeart && (
              <button
                className="icon-btn"
                disabled={isBusy(ref)}
                onClick={() => toggle(ref)}
                aria-pressed={isFavorite(ref)}
                aria-label={isFavorite(ref) ? `Quitar ${ref} de favoritos` : `Agregar ${ref} a favoritos`}
              >
                <HeartIcon filled={isFavorite(ref)} className={isFavorite(ref) ? 'text-accent' : 'text-muted'} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ImageBlock({ block }) {
  return (
    <figure className="mt-6">
      <LessonImage src={block.src} className="h-48 w-full rounded-2xl sm:h-64" />
      {block.caption && <figcaption className="mt-2 text-center text-sm text-muted">{block.caption}</figcaption>}
    </figure>
  )
}

function DecisionBlock({ block, lessonId }) {
  const key = KEYS.decision(lessonId, block.id)
  const [checked, setChecked] = useState(() => !!read(key, false))
  return (
    <section className="mt-10 rounded-2xl border border-line bg-soft p-5">
      {block.text && <p className="font-serif text-lg italic leading-8"><Rich>{block.text}</Rich></p>}
      <label className="mt-4 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
            write(key, e.target.checked)
          }}
          className="h-6 w-6 shrink-0 cursor-pointer accent-[rgb(var(--accent))]"
        />
        <span className="font-medium">{block.checkboxLabel}</span>
      </label>
    </section>
  )
}

/* ---------- Despachador ---------- */
export default function Block({ block, lessonId, number, answers, status, onAnswer }) {
  switch (block.type) {
    case 'section':
      return <SectionBlock block={block} />
    case 'text':
      return <TextBlock block={block} />
    case 'list':
      return <ListBlock block={block} />
    case 'callout':
      return <CalloutBlock block={block} />
    case 'banner':
      return <BannerBlock block={block} />
    case 'verses':
      return <VersesBlock block={block} />
    case 'image':
      return <ImageBlock block={block} />
    case 'decision':
      return <DecisionBlock block={block} lessonId={lessonId} />
    case 'question':
      return (
        <QuestionBlock
          number={number}
          question={block}
          value={answers[block.id] || ''}
          status={status[block.id]}
          onChange={onAnswer}
        />
      )
    default:
      return null // tipo desconocido: se avisa en consola (ver validateLesson)
  }
}
