import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Crear cuenta directamente sin verificación por correo
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // ya no se envía correo de confirmación, pero puedes guardar metadatos
        data: { nombre },
      },
    })

    if (signUpError) {
      console.error(signUpError)
      setError(signUpError.message)
      return
    }

    // Si se crea correctamente el usuario:
    alert('Cuenta creada exitosamente ✅')
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-white">Crear cuenta</h1>
      <form onSubmit={handleRegistro} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
          required
        />
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
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
