'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  // Detectar sesión activa
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-30 bg-secondary/70 backdrop-blur-md border-b border-border text-foreground transition-colors">
      
      {/* CONTENEDOR RESPONSIVE */}
      <div className="
        w-full 
        px-3 sm:px-4 md:px-6 
        py-3 
        max-w-full 
        flex flex-col 
        gap-3 
        md:flex-row 
        md:items-center 
        md:justify-between
      ">

        {/* IZQUIERDA */}
        <div className="flex items-center justify-between w-full md:w-auto">
          
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-primary hover:text-[var(--color-primary-hover)] transition"
          >
            💊 SoloFarmacias
          </Link>

          {/* Toggle Tema (visible en mobile aquí) */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* ENLACES // se mueve a línea 2 en mobile */}
        <div className="flex flex-wrap items-center gap-4 text-sm w-full md:w-auto justify-between md:justify-end">

          {/* Quiénes Somos */}
          <Link
            href="/quienes-somos"
            className="hover:text-primary transition-colors font-medium text-sm"
          >
            Quiénes Somos
          </Link>

          {/* SESIÓN */}
          {user ? (
            <>
              <span className="opacity-80 hidden sm:inline">👤 {user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md border border-border hover:bg-primary hover:text-white transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-primary transition-colors"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/registro"
                className="px-3 py-1.5 rounded-md bg-primary text-white hover:bg-[var(--color-primary-hover)] transition whitespace-nowrap"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* Toggle Tema (visible en desktop aquí) */}
          <div className="hidden md:block ml-4 border-l border-border pl-4">
            <ThemeToggle />
          </div>

        </div>

      </div>
    </header>
  )
}
