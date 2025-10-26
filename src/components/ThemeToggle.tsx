'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 bg-secondary border border-border text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-sm"
      title="Cambiar tema"
    >
      {theme === 'dark' ? (
        <>
          <span role="img" aria-label="sol">☀️</span> Claro
        </>
      ) : (
        <>
          <span role="img" aria-label="luna">🌙</span> Oscuro
        </>
      )}
    </button>
  )
}
