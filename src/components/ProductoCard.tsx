import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// === Props del componente ===
type Props = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  link: string
  imagen_url?: string | null
  id_medicamento: number
}

export default function ProductoCard({
  nombre,
  precio,
  precio_normal,
  farmacia,
  url,
  link,
  imagen_url,
  id_medicamento
}: Props) {
  const ahorro = precio_normal - precio
  const hayOferta = ahorro > 0

  // --- Estado local ---
  const [user, setUser] = useState<any>(null)
  const [alerting, setAlerting] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [yaAlertado, setYaAlertado] = useState(false)

  // --- Ver si el usuario está logeado ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user || null)
    }
    fetchUser()
  }, [])

  // --- Revisar si YA EXISTE una alerta para este medicamento ---
  useEffect(() => {
    if (!user) return

    const checkAlert = async () => {
      const { data: existe } = await supabase
        .from('alertas')
        .select('*')
        .eq('id_usuario', user.id)
        .eq('id_medicamento', id_medicamento)
        .maybeSingle()

      if (existe) {
        setYaAlertado(true)
      }
    }

    checkAlert()
  }, [user, id_medicamento])

  // --- Crear alerta ---
  const activarAlerta = async () => {
    if (!user) return

    setAlerting(true)
    setAlertMessage(null)

    try {
      // 1) Verificar si ya existe alerta
      const { data: existe } = await supabase
        .from('alertas')
        .select('*')
        .eq('id_usuario', user.id)
        .eq('id_medicamento', id_medicamento)
        .maybeSingle()

      if (existe) {
        setYaAlertado(true)
        setAlertMessage('Ya tienes una alerta activa para este medicamento.')
        setAlerting(false)
        return
      }

      // 2) Crear alerta nueva
      const { error } = await supabase
        .from('alertas')
        .insert({
          id_usuario: user.id,
          id_medicamento: id_medicamento,
          precio_objetivo: precio
        })

      if (error) {
        setAlertMessage('Error al crear alerta: ' + error.message)
      } else {
        setYaAlertado(true)
        setAlertMessage('Alerta activada correctamente 🎉')
      }

    } catch (err) {
      setAlertMessage('Error inesperado.')
    }

    setAlerting(false)
  }

  return (
    <div
      className="bg-secondary/70 backdrop-blur-sm border border-border 
                 rounded-2xl shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:border-primary/60 
                 transition-all duration-300 p-4 flex flex-col justify-between 
                 transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* IMAGEN */}
      <Link href={link} className="block group">
        <div className="w-full h-40 relative mb-3 overflow-hidden rounded-lg bg-secondary/80 flex items-center justify-center">
          {imagen_url ? (
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              sizes="100%"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-foreground/60 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-primary group-hover:text-[var(--primary-hover)] transition-colors">
          {nombre}
        </h2>
      </Link>

      {/* DETALLES */}
      <div className="mt-2 flex-1">
        <p className="text-sm text-foreground/70 mb-1">
          <strong>{farmacia}</strong>
        </p>

        <p className="text-green-600 font-semibold text-sm sm:text-base">
          Precio Oferta: ${precio.toLocaleString('es-CL')}
        </p>

        <p className="text-sm text-foreground/60 line-through">
          Precio Normal: ${precio_normal.toLocaleString('es-CL')}
        </p>

        {hayOferta && (
          <p className="text-xs text-primary mt-1">
            Ahorro de ${ahorro.toLocaleString('es-CL')}
          </p>
        )}
      </div>

      {/* BOTÓN DE ALERTA */}
      {user && (
        <div className="mt-2">

          <div className="flex justify-end">
            <button
              onClick={activarAlerta}
              disabled={alerting || yaAlertado}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center gap-2 shadow-sm transition
                ${yaAlertado 
                  ? "bg-gray-500 cursor-not-allowed text-white opacity-60" 
                  : "bg-primary text-white hover:bg-[var(--primary-hover)]"}`}
            >
              {yaAlertado
                ? "🔕 Alerta activa"
                : alerting
                  ? "Guardando…"
                  : "🔔 Activar alerta"}
            </button>
          </div>

          {alertMessage && (
            <p className="text-xs mt-1 text-primary text-right animate-fadeIn">
              {alertMessage}
            </p>
          )}

        </div>
      )}
    </div>
  )
}
