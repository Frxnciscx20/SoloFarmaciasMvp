import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

type HistorialData = {
  fecha: string
  precio_actual: number
  precio_normal: number
}

export default function HistorialPrecios() {
  const router = useRouter()
  const { id } = router.query
  const [historial, setHistorial] = useState<HistorialData[]>([])
  const [nombreMedicamento, setNombreMedicamento] = useState('Cargando...')
  const [nombreFarmacia, setNombreFarmacia] = useState('No especificada')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null) // ✅ tipo explícito

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)
      const idNum = Number(id)

      const { data, error } = await supabase
        .from('vista_historial_precios')
        .select('*')
        .eq('id_medicamento', idNum)
        .order('fecha_actualizacion', { ascending: true })

      if (error || !data || data.length === 0) {
        console.error('❌ Error al consultar vista:', error)
        setNombreMedicamento('No disponible')
        setHistorial([])
        setLoading(false)
        return
      }

      const procesado = data.map((item) => ({
        fecha: new Date(item.fecha_actualizacion).toLocaleDateString('es-CL'),
        precio_actual: item.precio_actual,
        precio_normal: item.precio_normal,
      }))

      setNombreMedicamento(data[0].nombre_medicamento || 'No disponible')
      setNombreFarmacia(data[0].farmacia || 'No especificada')
      setHistorial(procesado)
      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
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
                <span className="hidden sm:inline">👤 {user.email}</span>
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

      <main className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow space-y-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">📈 Historial de Precios</h2>
          <p className="mb-1">
            Medicamento:{' '}
            <span className="font-semibold">{nombreMedicamento}</span>
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Farmacia: <span className="text-gray-800">{nombreFarmacia}</span>
          </p>

          {loading ? (
            <p>Cargando historial...</p>
          ) : historial.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historial}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="fecha" />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const label =
                      name === 'precio_actual'
                        ? 'Precio Oferta'
                        : name === 'precio_normal'
                        ? 'Precio Normal'
                        : name
                    return [`$${value}`, label]
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="precio_normal"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Precio Normal"
                />
                <Line
                  type="monotone"
                  dataKey="precio_actual"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Precio Oferta"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No hay historial de precios disponible.</p>
          )}
        </div>
      </main>
    </div>
  )
}
