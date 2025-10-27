'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Cargar tema guardado o preferencia del sistema
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved ?? (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    // ⚠️ Limpia cualquier clase 'dark' que haya quedado de intentos anteriores
    document.documentElement.classList.remove('dark')
    // Usa data-theme como fuente de verdad
    document.documentElement.dataset.theme = initial
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    // ⚠️ Asegura que no dependemos de la clase 'dark'
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = next
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
