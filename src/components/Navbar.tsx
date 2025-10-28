'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  // 🔐 Detectar sesión activa en Supabase
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* NUEVO GRUPO IZQUIERDO: Logo + Quiénes Somos */}
        <div className="flex items-center gap-4"> 
            
            {/* 💊 Logo */}
            <Link
                href="/"
                className="text-xl font-semibold text-primary hover:text-[var(--color-primary-hover)] transition"
            >
                💊 SoloFarmacias
            </Link>

            {/* ENLACE QUIÉNES SOMOS, pegado al logo */}
            <Link
                href="/quienes-somos"
                className="hover:text-primary transition-colors font-medium text-sm pt-0.5" // Añadí text-sm y pt-0.5 para alineación
            >
                Quiénes Somos
            </Link>
        </div>
        
        {/* 🌗 GRUPO DERECHO: (Sesión + ThemeToggle) */}
        <div className="flex items-center gap-4 text-sm">

          {/* Botones de sesión */}
          {user ? (
            <>
              <span className="hidden sm:inline opacity-80">
                👤 {user.email ?? 'Usuario'}
              </span>
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
                className="px-3 py-1.5 rounded-md bg-primary text-white hover:bg-[var(--color-primary-hover)] transition"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* 🔘 ThemeToggle al final, separado visualmente */}
          <div className="ml-4 border-l border-border pl-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
