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

    // Iniciar sesión
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      return
    }

    // Obtener información del usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData.user) {
      setError('No se pudo obtener información del usuario.')
      return
    }

    const id = userData.user.id
    const correo = userData.user.email

    // Verificar si ya existe perfil en la tabla usuario
    const { data: perfil, error: perfilError } = await supabase
      .from('usuario')
      .select('id_usuario')
      .eq('id_usuario', id)
      .maybeSingle() // <- evita crash si no hay resultado

    if (!perfil && !perfilError) {
      const { error: insertError } = await supabase.from('usuario').insert([
        {
          id_usuario: id,
          nombre: 'Anónimo',
          correo: correo || ''
        }
      ])

      if (insertError) {
        console.error('Error al insertar usuario:', insertError.message)
        // No detenemos el flujo, solo avisamos
      }
    }

    // Redirigir al home
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
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
        <button type="submit" className="bg-red-500 text-white p-2 rounded">
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
