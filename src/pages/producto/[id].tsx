'use client'
import { GetServerSideProps } from 'next'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ComentarioForm from '@/components/ComentarioForm'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import AlertSwitch from '@/components/AlertSwitch'

type Comentario = {
  comentario: string
  fecha: string
  usuario: {
    nombre: string
  } | null
}

type Producto = {
  id_medicamento: number
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id
  const parsedId = Number(id)

  if (!parsedId) return { notFound: true }

  const { data: productoData, error } = await supabase
    .from('vista_productos')
    .select('*')
    .eq('id_medicamento', parsedId)
    .limit(1)

  const { data: comentariosData, error: comentariosError } = await supabase
    .from('comentarios')
    .select(`
      comentario,
      fecha,
      usuario (
        nombre
      )
    `)
    .eq('id_medicamento', parsedId)
    .order('fecha', { ascending: false })

  if (error || comentariosError || !productoData || productoData.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      producto: productoData[0],
      comentarios: comentariosData || [],
    },
  }
}

function ComentarioItem({ comentario }: { comentario: Comentario }) {
  const [fechaLocal, setFechaLocal] = useState('')

  useEffect(() => {
    if (comentario.fecha) {
      setFechaLocal(
        new Date(comentario.fecha).toLocaleString('es-CL', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      )
    }
  }, [comentario.fecha])

  const inicial =
    comentario.usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() ?? 'U'

  return (
    <li className="bg-secondary/80 border border-border rounded-xl p-4 shadow-sm flex gap-3">
      {/* Avatar simple con inicial */}
      <div className="h-9 w-9 rounded-full bg-primary/90 flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {inicial}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            {comentario.usuario?.nombre ?? 'Usuario'}
          </p>
          {fechaLocal && (
            <p className="text-xs text-foreground/60">{fechaLocal}</p>
          )}
        </div>
        <p className="text-sm mt-1 text-foreground">{comentario.comentario}</p>
      </div>
    </li>
  )
}

export default function ProductoDetalle({
  producto,
  comentarios,
}: {
  producto: Producto
  comentarios: Comentario[]
}) {
  const ahorro = producto.precio_normal - producto.precio
  const hayOferta = ahorro > 0

  const [user, setUser] = useState<User | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Estado para alerta
  const [alertaActiva, setAlertaActiva] = useState(false)
  const [alertId, setAlertId] = useState<number | null>(null)
  const [loadingAlerta, setLoadingAlerta] = useState(false)
  const [alertaMensaje, setAlertaMensaje] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Cargar estado inicial de la alerta (si existe y si está activa)
  useEffect(() => {
    if (!user) return

    const fetchAlerta = async () => {
      const { data, error } = await supabase
        .from('alertas')
        .select('id, activo')
        .eq('id_usuario', user.id)
        .eq('id_medicamento', producto.id_medicamento)
        .maybeSingle()

      if (!error && data) {
        setAlertId(data.id)
        setAlertaActiva(data.activo)
      }
    }

    fetchAlerta()
  }, [user, producto.id_medicamento])

  // Toggle de alerta con switch (ON/OFF)
  const handleToggleAlerta = async () => {
    if (!user) return
    setLoadingAlerta(true)
    setAlertaMensaje('')

    try {
      // Caso 1: no existe registro → crearlo activo
      if (alertId === null) {
        const { data, error } = await supabase
          .from('alertas')
          .insert({
            id_usuario: user.id,
            id_medicamento: producto.id_medicamento,
            precio_objetivo: producto.precio,
            activo: true,
          })
          .select()
          .single()

        if (error) throw error

        setAlertId(data.id)
        setAlertaActiva(true)
        setAlertaMensaje('✅ Te avisaremos cuando baje el precio.')
        setLoadingAlerta(false)
        return
      }

      // Caso 2: ya existe → actualizar activo
      const { error } = await supabase
        .from('alertas')
        .update({ activo: !alertaActiva })
        .eq('id', alertId)

      if (error) throw error

      const nuevoEstado = !alertaActiva
      setAlertaActiva(nuevoEstado)
      setAlertaMensaje(
        nuevoEstado
          ? '✅ Alerta activada. Te avisaremos cuando baje el precio.'
          : '🔕 Alerta desactivada.'
      )
    } catch (e) {
      setAlertaMensaje('❌ Error al actualizar la alerta.')
    }

    setLoadingAlerta(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto mt-8 p-6 bg-secondary rounded-2xl shadow-xl border border-border transition-all hover:shadow-2xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-foreground/70 flex items-center gap-2">
          <Link
            href="/"
            className="hover:text-primary hover:underline transition-colors"
          >
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground/90 font-medium truncate max-w-[60%]">
            {producto.nombre}
          </span>
        </div>

        {/* 🏷️ Detalle del producto */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Imagen */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-background border border-border shadow-lg p-3 w-full max-w-md flex items-center justify-center">
              <Image
                src={
                  producto.imagen_url ||
                  `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                    producto.nombre
                  )}`
                }
                alt={producto.nombre}
                width={400}
                height={300}
                className="rounded-xl object-contain max-h-[360px] bg-white"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">
                {producto.nombre}
              </h1>
              <p className="text-sm text-foreground/70">
                Farmacia:{' '}
                <span className="font-semibold text-foreground">
                  {producto.farmacia}
                </span>
              </p>
            </div>

            {/* Bloque de precio */}
            <div className="bg-background/70 border border-border rounded-xl p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-foreground/60">
                Precio actual
              </p>
              <p className="text-3xl font-semibold text-primary">
                ${producto.precio.toLocaleString('es-CL')}
              </p>
              <p className="text-sm text-foreground/60 line-through">
                Precio normal: $
                {producto.precio_normal.toLocaleString('es-CL')}
              </p>

              {hayOferta && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[var(--color-accent)] text-xs text-primary font-medium">
                  <span>🔻 Ahorro</span>
                  <span>${ahorro.toLocaleString('es-CL')}</span>
                </div>
              )}
            </div>

            {/* Botón ver en farmacia */}
            <a
              href={producto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-primary hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition shadow-sm text-sm"
            >
              Ver producto en farmacia
              <span aria-hidden>↗</span>
            </a>

            {/* Acciones: Opinión + Alerta */}
            <div className="mt-4 space-y-3">
              {user ? (
                <>
                  <button
                    className="w-full bg-[var(--color-accent)] text-sm py-2.5 rounded-md hover:bg-[var(--color-primary-hover)] hover:text-white transition"
                    onClick={() => setMostrarFormulario((prev) => !prev)}
                  >
                    💬 {mostrarFormulario ? 'Ocultar opinión' : 'Dar opinión de compra'}
                  </button>

                  {/* Switch de alerta */}
                  <div className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-medium text-foreground flex items-center gap-1">
                        🔔 Alerta de baja de precio
                      </p>
                      <p className="text-foreground/60">
                        Activa la alerta para que te avisemos si este medicamento
                        baja de precio.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <AlertSwitch
                        checked={alertaActiva}
                        onChange={handleToggleAlerta}
                        disabled={loadingAlerta}
                      />
                      {alertaMensaje && (
                        <span className="text-[10px] text-primary text-right">
                          {alertaMensaje}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-foreground/70 italic">
                  Inicia sesión para dejar un comentario o recibir alertas de precio.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 💬 Opiniones */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
            💬 Opiniones
            <span className="text-xs text-foreground/60">
              ({comentarios.length} comentario
              {comentarios.length === 1 ? '' : 's'})
            </span>
          </h3>

          {user && mostrarFormulario && (
            <div className="mb-6 bg-background/60 border border-border rounded-xl p-4">
              <ComentarioForm idMedicamento={producto.id_medicamento} />
            </div>
          )}

          {comentarios.length > 0 ? (
            <ul className="space-y-4 mt-2">
              {comentarios.map((c, idx) => (
                <ComentarioItem key={idx} comentario={c} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/70 mt-4">
              Aún no hay comentarios. Sé el primero en compartir tu experiencia.
            </p>
          )}
        </div>

        {/* 🔙 Volver */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-[var(--color-primary-hover)] transition"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
