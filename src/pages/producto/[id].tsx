'use client'
import { GetServerSideProps } from 'next'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ComentarioForm from '@/components/ComentarioForm'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

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
      setFechaLocal(new Date(comentario.fecha).toLocaleString())
    }
  }, [comentario.fecha])

  return (
    <li className="bg-[var(--color-accent)] p-4 rounded-lg shadow-sm">
      <p className="text-foreground">{comentario.comentario}</p>
      <p className="text-xs text-foreground/70 mt-1">
        {comentario.usuario?.nombre
          ? `Publicado por ${comentario.usuario.nombre}`
          : 'Publicado'}
        {fechaLocal && ` el ${fechaLocal}`}
      </p>
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
  const [alertaMensaje, setAlertaMensaje] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleAlerta = async () => {
    if (!user) return
    setAlertaMensaje('')

    const { data: existente, error: errorExistente } = await supabase
      .from('alertas')
      .select('id')
      .eq('id_usuario', user.id)
      .eq('id_medicamento', producto.id_medicamento)
      .single()

    if (errorExistente || !existente) {
      const { error: insertError } = await supabase.from('alertas').insert([
        {
          id_usuario: user.id,
          id_medicamento: producto.id_medicamento,
          precio_objetivo: producto.precio,
        },
      ])

      if (insertError) {
        setAlertaMensaje('❌ Error al crear la alerta.')
      } else {
        setAlertaMensaje('✅ Te avisaremos cuando baje el precio.')
      }
    } else {
      setAlertaMensaje('📬 Ya tienes una alerta activa para este producto.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto mt-8 p-6 bg-secondary rounded-2xl shadow-xl border border-border transition-all hover:shadow-2xl">
        {/* 🏷️ Detalle del producto */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <Image
              src={
                producto.imagen_url ||
                `https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre)}`
              }
              alt={producto.nombre}
              width={400}
              height={300}
              className="rounded-xl shadow-lg object-contain max-h-[400px] bg-white p-2"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">{producto.nombre}</h2>
            <p className="text-md">
              Farmacia: <strong>{producto.farmacia}</strong>
            </p>

            <div>
              <p className="text-2xl font-semibold text-primary">
                💲 Precio Oferta: ${producto.precio}
              </p>
              <p className="text-sm text-foreground/70 line-through">
                Precio Normal: ${producto.precio_normal}
              </p>
              {hayOferta && (
                <p className="text-sm text-blue-600 mt-1">
                  🔻 Ahorro de ${ahorro}
                </p>
              )}
            </div>

            <a
              href={producto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2 bg-primary hover:bg-[var(--color-primary-hover)] text-white rounded-lg transition"
            >
              Ver producto en farmacia
            </a>

            <div className="mt-6 space-y-2">
              {user ? (
                <>
                  <button
                    className="w-full bg-[var(--color-accent)] text-sm py-2 rounded-md hover:bg-[var(--color-primary-hover)] hover:text-white transition"
                    onClick={() => setMostrarFormulario((prev) => !prev)}
                  >
                    💬 Dar opinión de compra
                  </button>
                  <button
                    className="w-full bg-[var(--color-accent)] text-sm py-2 rounded-md hover:bg-[var(--color-primary-hover)] hover:text-white transition"
                    onClick={handleAlerta}
                  >
                    📩 Avisar cuando baje de precio
                  </button>
                  {alertaMensaje && (
                    <p className="text-sm text-blue-600 mt-2 text-center">{alertaMensaje}</p>
                  )}
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
          <h3 className="text-xl font-semibold mb-4 text-primary">💬 Opiniones</h3>

          {user && mostrarFormulario && (
            <ComentarioForm idMedicamento={producto.id_medicamento} />
          )}

          {comentarios.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {comentarios.map((c, idx) => (
                <ComentarioItem key={idx} comentario={c} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/70 mt-4">
              Aún no hay comentarios.
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
