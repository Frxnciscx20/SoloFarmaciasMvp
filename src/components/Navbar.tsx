'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import ThemeToggle from './ThemeToggle'

type SimpleUser = {
  id: string
  email: string
}

export default function Navbar() {
  const [user, setUser] = useState<SimpleUser | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      const userData = data.user
      if (userData?.id && userData?.email) {
        setUser({ id: userData.id, email: userData.email })
      }
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null)
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="bg-gradient-to-r from-primary to-emerald-600 text-white shadow-card transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold hover:opacity-90 transition"
        >
          <span role="img" aria-label="píldora">
            💊
          </span>
          <span className="tracking-tight">SoloFarmacias</span>
        </Link>

        {/* Controles */}
        <div className="flex items-center space-x-4 text-sm">
          {/* Botón de tema */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-white/90">
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-1 rounded-md hover:bg-[var(--color-primary-hover)] hover:text-white font-medium transition"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="hover:text-gray-100 font-medium transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="hover:text-gray-100 font-medium transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
