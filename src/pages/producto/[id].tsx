import { GetServerSideProps } from 'next'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ComentarioForm from '../../components/ComentarioForm'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'

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
    <li className="bg-gray-100 p-4 rounded shadow-sm">
      <p className="text-gray-800">{comentario.comentario}</p>
      <p className="text-xs text-gray-500 mt-1">
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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-red-600 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">💊 SoloFarmacias</h1>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/" className="hover:underline">Volver al inicio</Link>
            {user ? (
              <>
                <span className="hidden sm:inline">👤 {user.email ?? 'Usuario'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 px-3 py-1 rounded hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">Iniciar sesión</Link>
                <Link href="/registro" className="hover:underline">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow space-y-12 mt-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex justify-center items-start">
            <Image
              src={
                producto.imagen_url ||
                `https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre)}`
              }
              alt={producto.nombre}
              width={400}
              height={300}
              className="rounded-xl shadow-lg max-h-[400px] object-contain"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-red-600">{producto.nombre}</h2>
            <p className="text-gray-600 text-md">
              Farmacia: <strong>{producto.farmacia}</strong>
            </p>

            <div>
              <p className="text-green-600 text-2xl font-semibold">
                💲 Precio Oferta: ${producto.precio}
              </p>
              <p className="text-sm text-gray-600 line-through">
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
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Ver producto en farmacia
            </a>

            <div className="mt-6 space-y-2">
              {user ? (
                <>
                  <button
                    className="w-full bg-gray-200 text-sm py-2 rounded hover:bg-gray-300"
                    onClick={() => setMostrarFormulario((prev) => !prev)}
                  >
                    💬 Dar opinión de compra
                  </button>
                  <button
                    className="w-full bg-gray-200 text-sm py-2 rounded hover:bg-gray-300"
                    onClick={handleAlerta}
                  >
                    📩 Avisar cuando baje de precio
                  </button>
                  {alertaMensaje && (
                    <p className="text-sm text-blue-600 mt-1">{alertaMensaje}</p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Inicia sesión para dejar un comentario o recibir alertas de precio.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">💬 Opiniones</h3>

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
            <p className="text-sm text-gray-500 mt-4">Aún no hay comentarios.</p>
          )}
        </div>
      </main>
    </div>
  )
}
