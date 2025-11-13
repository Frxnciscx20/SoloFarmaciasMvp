import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AlertSwitch from '@/components/AlertSwitch'

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

  const [user, setUser] = useState<any>(null)
  const [alertaActiva, setAlertaActiva] = useState(false)
  const [alertId, setAlertId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  // --- Obtener usuario logeado ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user || null)
    }
    fetchUser()
  }, [])

  // --- Revisar si YA existe una alerta ---
  useEffect(() => {
    if (!user) return

    const checkAlert = async () => {
      const { data } = await supabase
        .from('alertas')
        .select('id, activo')
        .eq('id_usuario', user.id)
        .eq('id_medicamento', id_medicamento)
        .maybeSingle()

      if (data) {
        setAlertId(data.id)
        setAlertaActiva(data.activo)
      }
    }

    checkAlert()
  }, [user, id_medicamento])

  // --- Cambiar estado del switch ---
  const toggleSwitch = async () => {
    if (!user) return
    setLoading(true)
    setMensaje(null)

    try {
      // Caso 1: No existe alerta → crear
      if (alertId === null) {
        const { data, error } = await supabase
          .from('alertas')
          .insert({
            id_usuario: user.id,
            id_medicamento,
            precio_objetivo: precio,
            activo: true
          })
          .select()
          .single()

        if (error) throw error

        setAlertId(data.id)
        setAlertaActiva(true)
        setMensaje("Alerta activada 🎉")
        setLoading(false)
        return
      }

      // Caso 2: ya existe → cambiar activo true/false
      const { error } = await supabase
        .from('alertas')
        .update({ activo: !alertaActiva })
        .eq('id', alertId)

      if (error) throw error

      setAlertaActiva(!alertaActiva)
      setMensaje(!alertaActiva ? "Alerta activada 🎉" : "Alerta desactivada")
      
    } catch {
      setMensaje("Error al actualizar la alerta")
    }

    setLoading(false)
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

      {/* SWITCH */}
      {user && (
        <div className="mt-4 flex flex-col items-end">
          <AlertSwitch
            checked={alertaActiva}
            onChange={toggleSwitch}
            disabled={loading}
          />

          {mensaje && (
            <span className="text-xs text-primary mt-1">{mensaje}</span>
          )}
        </div>
      )}
    </div>
  )
}
