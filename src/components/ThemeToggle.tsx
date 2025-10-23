'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Cargar el tema guardado o por defecto "light"
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initialTheme = saved || 'light'
    setTheme(initialTheme)
    document.documentElement.dataset.theme = initialTheme
  }, [])

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.dataset.theme = newTheme
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggle}
      className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-md text-sm shadow-card hover:bg-[var(--color-primary-hover)] transition"
    >
      {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
    </button>
  )
}
