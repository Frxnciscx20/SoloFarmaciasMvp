import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Iniciar sesión con email y password
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError('Credenciales incorrectas o usuario no existente.')
      console.error(loginError.message)
      return
    }

    const user = sessionData.user
    if (!user) {
      setError('No se pudo obtener información del usuario.')
      return
    }

    const id = user.id
    const correo = user.email
    const nombre = user.user_metadata?.nombre || 'Anónimo'

    // Verificar si ya existe perfil en tabla usuario
    const { data: perfil, error: perfilError } = await supabase
      .from('usuario')
      .select('id_usuario')
      .eq('id_usuario', id)
      .maybeSingle()

    if (!perfil && !perfilError) {
      const { error: insertError } = await supabase.from('usuario').insert([
        {
          id_usuario: id,
          nombre,
          correo: correo || '',
        },
      ])

      if (insertError) {
        console.error('Error al insertar usuario:', insertError.message)
      }
    }

    // Redirigir al home
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-white">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
