'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 🧠 Detectar tema del sistema o guardado en localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', systemDark)
    }
  }, [])

  // 🎚 Cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1 rounded-md border border-border hover:bg-accent transition text-sm"
      title="Cambiar tema"
    >
      {theme === 'light' ? (
        <>
          ☀️ <span className="hidden sm:inline">Claro</span>
        </>
      ) : (
        <>
          🌙 <span className="hidden sm:inline">Oscuro</span>
        </>
      )}
    </button>
  )
}
