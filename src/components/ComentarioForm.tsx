'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function ComentarioForm({ idMedicamento }: { idMedicamento: number }) {
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
// ⬅️ Nueva inicialización: Tienes que usar el hook para obtener el objeto router
  const router = useRouter()
  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setMensaje('')

    const { data: user } = await supabase.auth.getUser()

    const { error } = await supabase.from('comentarios').insert({
      comentario,
      id_medicamento: idMedicamento,
      id_usuario: user.user?.id,
      
      // ✅ Solución: Inyectar la hora UTC perfecta
      fecha: new Date().toISOString(), 
    })

    if (error) {
      setMensaje('❌ Error al enviar comentario.')
    } else {
      setMensaje('✅ Comentario enviado correctamente.')
      setComentario('')
      router.replace(router.asPath) // 🔄 recarga la página para mostrar el nuevo comentario
    }

    setEnviando(false)
  }

  return (
    <form onSubmit={handleEnviar} className="space-y-3">

      {/* Etiqueta */}
      <p className="text-sm text-foreground/80 font-medium flex items-center gap-1">
        📝 Deja tu opinión
      </p>

      {/* Textarea */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Escribe tu opinión…"
        className="w-full rounded-xl p-3 bg-secondary border border-border 
                   text-foreground focus:ring-2 focus:ring-primary 
                   focus:outline-none transition resize-none"
        rows={3}
        required
      />

      {/* Botón pequeño */}
      <button
        type="submit"
        disabled={enviando}
        className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm 
                   hover:bg-[var(--color-primary-hover)] transition 
                   disabled:opacity-50 shadow-sm"
      >
        {enviando ? 'Enviando…' : 'Enviar'}
      </button>

      {mensaje && (
        <p
          className={`text-sm ${
            mensaje.includes('✅') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  )
}
