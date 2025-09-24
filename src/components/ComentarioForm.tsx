import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ComentarioForm({ idMedicamento }: { idMedicamento: number }) {
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setMensaje('')

    const { data: user } = await supabase.auth.getUser()

    const { error } = await supabase.from('comentarios').insert({
      comentario,
      id_medicamento: idMedicamento,
      id_usuario: user.user?.id,
    })

    if (error) {
      setMensaje('❌ Error al enviar comentario.')
    } else {
      setMensaje('✅ Comentario enviado correctamente.')
      setComentario('')
      window.location.reload() // 🔄 recarga la página para mostrar el nuevo comentario
    }

    setEnviando(false)
  }

  return (
    <form onSubmit={handleEnviar} className="space-y-2">
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Escribe tu opinión..."
        className="w-full border border-gray-300 p-2 rounded"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={enviando}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {enviando ? 'Enviando...' : 'Enviar comentario'}
      </button>
      {mensaje && (
        <p className={`text-sm ${mensaje.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}
