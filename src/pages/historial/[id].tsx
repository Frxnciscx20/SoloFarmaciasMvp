'use client'
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
import Navbar from '@/components/Navbar'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

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
  const [user, setUser] = useState<User | null>(null)

  // 🔹 Cargar usuario
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔹 Cargar historial de precios
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 mt-8 bg-[var(--card-bg)] rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            📈 Historial de Precios
          </h2>
          <p className="text-lg">
            Medicamento: <span className="font-semibold">{nombreMedicamento}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Farmacia: <span className="font-medium">{nombreFarmacia}</span>
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : historial.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historial}>
              <CartesianGrid stroke="rgba(0,0,0,0.1)" strokeDasharray="4 4" />
              <XAxis dataKey="fecha" stroke="var(--color-foreground)" />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                stroke="var(--color-foreground)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
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
                stroke="#3b82f6"
                strokeWidth={2}
                name="Precio Normal"
              />
              <Line
                type="monotone"
                dataKey="precio_actual"
                stroke="#06b6d4"
                strokeWidth={3}
                name="Precio Oferta"
                dot={{ r: 4, fill: '#06b6d4' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            No hay historial de precios disponible.
          </p>
        )}

        <div className="text-center mt-8">
          <Link
            href={`/producto/${id}`}
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            ← Volver al producto
          </Link>
        </div>
      </main>
    </div>
  )
}
