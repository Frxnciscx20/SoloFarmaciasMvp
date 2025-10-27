'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link' // ✅ Import necesario
import { supabase } from '@/lib/supabaseClient'
import ThemeToggle from '@/components/ThemeToggle'

export default function RegistroPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Cuenta creada correctamente. Revisa tu correo para confirmar tu registro.')
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground transition-colors">
      {/* 🔘 Botón modo oscuro/claro */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-secondary p-6 rounded-xl shadow-md border border-border"
      >
        <h1 className="text-2xl font-semibold text-center text-foreground mb-6">
          Crear cuenta
        </h1>

        {/* Email */}
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

        {/* Confirmar contraseña */}
        <label htmlFor="confirmPassword" className="block text-sm text-foreground mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 rounded-md border border-border px-3 py-2 outline-none 
                     focus:ring-2 focus:ring-primary bg-[var(--color-secondary)] text-foreground"
          required
        />

        {/* Mensajes */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-[var(--color-primary-hover)] 
                     transition disabled:opacity-60"
        >
          {loading ? 'Registrando…' : 'Registrarme'}
        </button>

        {/* Link hacia login */}
        <p className="text-center text-sm text-foreground mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
