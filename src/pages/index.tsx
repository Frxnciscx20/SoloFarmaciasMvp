// src/pages/index.tsx

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductoCard from '../components/ProductoCard'
import Filtros from '../components/Filtros'
import Navbar from '../components/Navbar'
import RandomBanner from '../components/RandomBanner' // <--- 1. Importar RandomBanner

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

// Función de utilidad para obtener N elementos aleatorios (Copiada de quienes-somos.tsx)
function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 2. Modificar getServerSideProps para obtener productos para el banner
export async function getServerSideProps() {
  // Obtener TODOS los productos para la búsqueda/filtro Y el banner
  const { data: productos } = await supabase.from('vista_productos').select('*')
  
  const allProducts = productos || [];
  
  // Selecciona 10 productos aleatorios para el banner
  const bannerProducts = getRandomItems(allProducts, 10); // <--- Lógica del banner

  return { 
    props: { 
      productos: allProducts, // Todos los productos para la página principal
      bannerProducts: bannerProducts // Productos del banner
    } 
  }
}

// 3. Modificar el tipo de las props del componente Home
type HomeProps = { 
    productos: Producto[];
    bannerProducts: Producto[]; // Incluir los productos del banner en las props
}

// 4. Modificar el componente Home para recibir y usar el banner
export default function Home({ productos, bannerProducts }: HomeProps) {
  // 🚨 DEBES DEFINIR ESTAS VARIABLES DE ESTADO 🚨
  const [busqueda, setBusqueda] = useState('') //
  const [farmacia, setFarmacia] = useState('') //
  // ... (resto del estado y lógica de filtrado)

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (farmacia === '' || p.farmacia.toLowerCase().includes(farmacia.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      
      {/* 5. AÑADIR EL BANNER AQUÍ (debajo de Navbar, arriba del main) */}
      <RandomBanner productos={bannerProducts} /> 

      <main className="container mx-auto px-4 py-8 pt-20">
        
        {/* ... (Resto del contenido: título, filtros, grid de productos) */}
        <h2 className="text-xl font-semibold mb-4 text-center text-primary transition-colors">
          Encuentra los mejores precios en farmacias 💊
        </h2>

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

      {/* Footer: Ya usa clases temáticas */}
      <footer className="mt-12 bg-secondary text-center text-sm text-foreground/70 py-4 border-t border-border">
        <p>© {new Date().getFullYear()} SoloFarmacias — Proyecto Scraper</p>
      </footer>
    </div>
  )
}