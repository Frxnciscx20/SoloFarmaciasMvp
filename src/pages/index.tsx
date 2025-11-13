// src/pages/index.tsx

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductoCard from '../components/ProductoCard'
import Filtros from '../components/Filtros'
import Navbar from '../components/Navbar'
import RandomBanner from '../components/RandomBanner'

// Define el tipo Producto
type Producto = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string
  id_medicamento: number
}

// Función de utilidad para obtener N elementos aleatorios
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Obtener datos desde Supabase
export async function getServerSideProps() {
  const { data: productos } = await supabase.from('vista_productos').select('*')

  const allProducts = productos || []
  const bannerProducts = getRandomItems(allProducts, 10)

  return {
    props: {
      productos: allProducts,
      bannerProducts: bannerProducts,
    },
  }
}

// Props del componente principal
type HomeProps = {
  productos: Producto[]
  bannerProducts: Producto[]
}

export default function Home({ productos, bannerProducts }: HomeProps) {
  const [busqueda, setBusqueda] = useState('')
  const [farmacia, setFarmacia] = useState('')

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (farmacia === '' ||
        p.farmacia.toLowerCase().includes(farmacia.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar /> 

      {/* Banner de productos destacados */}
      <RandomBanner productos={bannerProducts} />

    

      {/* Contenedor principal con menos espacio arriba */}
      <main className="container mx-auto px-4 py-6 pt-6">
        <Filtros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          farmacia={farmacia}
          setFarmacia={setFarmacia}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtrados.length > 0 ? (
            filtrados.map((p) => (
              <ProductoCard
                key={p.id_medicamento}
                nombre={p.nombre}
                precio={p.precio}
                precio_normal={p.precio_normal}
                farmacia={p.farmacia}
                url={p.url}
                imagen_url={p.imagen_url}
                id_medicamento={p.id_medicamento}
                link={`/producto/${p.id_medicamento}`}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-foreground/70">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-secondary text-center text-sm text-foreground/70 py-4 border-t border-border">
        <p>© {new Date().getFullYear()} SoloFarmacias — Proyecto Scraper</p>
      </footer>
    </div>
  )
}
