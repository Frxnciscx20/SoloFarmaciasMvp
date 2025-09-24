import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductoCard from '../components/ProductoCard'
import Filtros from '../components/Filtros'

export async function getServerSideProps() {
  const { data: productos, error } = await supabase.from('vista_productos').select('*')
  return { props: { productos: productos || [] } }
}

export default function Home({ productos }: { productos: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [farmacia, setFarmacia] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (farmacia === '' || p.farmacia.toLowerCase().includes(farmacia.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-red-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">💊 Comparador de Medicamentos</h1>
          <div className="flex items-center space-x-4 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline">👤 {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-600 px-4 py-1 rounded hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:underline">Iniciar sesión</a>
                <a href="/registro" className="hover:underline">Registrarse</a>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Filtros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          farmacia={farmacia}
          setFarmacia={setFarmacia}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtrados.length > 0 ? (
            filtrados.map((p, idx) => (
              <ProductoCard
                key={idx}
                nombre={p.nombre}
                precio={p.precio}
                precio_normal={p.precio_normal}
                farmacia={p.farmacia}
                url={p.url}
                imagen_url={p.imagen_url}
                id_medicamento={p.id_medicamento} // ✅ nuevo prop para historial
                link={`/producto/${p.id_medicamento}`}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
