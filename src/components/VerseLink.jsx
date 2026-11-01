import { useVerse } from '../context/VerseContext.jsx'
import { BookIcon } from './Icons.jsx'

export default function VerseLink({ reference, icon = true }) {
  const { open } = useVerse()
  return (
    <button type="button" className="verse-link" onClick={() => open(reference)}>
      {icon && <BookIcon width={16} height={16} />}
      {reference}
    </button>
  )
}
