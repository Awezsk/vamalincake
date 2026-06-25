'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'pink' | 'navy'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'pink', toggle: () => {} })

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'pink'
  const stored = localStorage.getItem('admin-theme') as Theme | null
  if (stored === 'pink' || stored === 'navy') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'navy' : 'pink'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('pink')

  useEffect(() => {
    setTheme(getPreferredTheme())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('admin-theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const stored = localStorage.getItem('admin-theme') as Theme | null
      if (!stored) setTheme(mq.matches ? 'navy' : 'pink')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setTheme((t) => (t === 'pink' ? 'navy' : 'pink'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
