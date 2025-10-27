'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/') // Redirige al home
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative">
      {/* 🔘 Botón de tema, flotante arriba a la derecha */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-secondary p-6 rounded-xl shadow-md border border-border"
      >
        <h1 className="text-2xl font-semibold text-center text-foreground mb-6">
          Iniciar sesión
        </h1>

        {/* Correo */}
        <label htmlFor="email" className="block text-sm text-foreground mb-1">
          Correo
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-md border border-border px-3 py-2 outline-none 
                     focus:ring-2 focus:ring-primary bg-[var(--color-secondary)] text-foreground"
          required
        />

        {/* Contraseña */}
        <label htmlFor="password" className="block text-sm text-foreground mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 rounded-md border border-border px-3 py-2 outline-none 
                     focus:ring-2 focus:ring-primary bg-[var(--color-secondary)] text-foreground"
          required
        />

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-[var(--color-primary-hover)] 
                     transition disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Entrar'}
        </button>

        {/* Registro */}
        <p className="text-center text-sm text-foreground mt-4">
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="text-primary hover:underline">
            Regístrate
          </a>
        </p>

        {/* Volver al inicio */}
        <div className="flex justify-center mt-4">
          <a
            href="/"
            className="inline-block border border-border text-primary px-4 py-2 rounded-md 
                       hover:bg-[var(--color-primary-hover)] hover:text-white transition text-sm"
          >
            ← Volver al inicio
          </a>
        </div>
      </form>
    </div>
  )
}
