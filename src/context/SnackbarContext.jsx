import { createContext, useContext, useState, useRef, useCallback } from 'react'

const SnackbarContext = createContext(null)

export function SnackbarProvider({ children }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  const showSnackbar = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(msg)
    setVisible(true)
    timerRef.current = setTimeout(() => setVisible(false), 2500)
  }, [])

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="bg-gray-700 text-white text-sm px-5 py-3 rounded-xl shadow-2xl whitespace-nowrap border border-gray-600">
          {message}
        </div>
      </div>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  return useContext(SnackbarContext)
}
