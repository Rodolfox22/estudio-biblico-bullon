import { createContext, useContext, useState } from 'react'
import VerseModal from '../components/VerseModal.jsx'

const VerseContext = createContext(null)
export const useVerse = () => useContext(VerseContext)

export function VerseProvider({ children }) {
  const [ref, setRef] = useState(null)
  return (
    <VerseContext.Provider value={{ open: setRef, close: () => setRef(null), isOpen: !!ref }}>
      {children}
      {ref && <VerseModal reference={ref} onClose={() => setRef(null)} />}
    </VerseContext.Provider>
  )
}
