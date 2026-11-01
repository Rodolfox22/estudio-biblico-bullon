import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const timer = useRef()
  const show = useCallback((text) => {
    setMsg(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(''), 3200)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4">
        {msg && (
          <div className="pop-in max-w-sm rounded-full bg-ink px-4 py-2 text-center text-sm text-bg shadow-lg">{msg}</div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
