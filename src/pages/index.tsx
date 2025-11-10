// src/pages/index.tsx

import { useState, useMemo } from 'react' // 1. Importar useMemo
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
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function getServerSideProps() {
  // Obtener TODOS los productos para la búsqueda/filtro Y el banner
  const { data: productos } = await supabase.from('vista_productos').select('*')
  
  const allProducts = productos || [];
  
  // Selecciona 10 productos aleatorios para el banner
  const bannerProducts = getRandomItems(allProducts, 10); 

  return { 
    props: { 
      productos: allProducts, // Todos los productos para la página principal
      bannerProducts: bannerProducts // Productos del banner
    } 
  }
}

type HomeProps = { 
    productos: Producto[];
    bannerProducts: Producto[]; 
}

export default function Home({ productos, bannerProducts }: HomeProps) {
  // 🚨 DEFINICIÓN DE VARIABLES DE ESTADO 🚨
  const [busqueda, setBusqueda] = useState('') 
  const [farmacia, setFarmacia] = useState('') 
  
  // 2. Estado de Paginación
  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 12 // Mostrar 15 productos por página
  
  // Lógica de Filtrado (usando useMemo para optimizar)
  const filtrados = useMemo(() => { // 3. Usar useMemo para el filtrado
    setPaginaActual(1); // 4. Resetear a la página 1 al cambiar filtros/búsqueda
    
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (farmacia === '' || p.farmacia.toLowerCase().includes(farmacia.toLowerCase()))
    )
  }, [productos, busqueda, farmacia])


  // Lógica de Paginación
  const totalPaginas = Math.ceil(filtrados.length / productosPorPagina)
  
  const indiceFinal = paginaActual * productosPorPagina
  const indiceInicial = indiceFinal - productosPorPagina
  
  // Productos a mostrar en la página actual
  const productosPaginados = filtrados.slice(indiceInicial, indiceFinal)

  // 5. Componente de Paginación
  const Paginacion = () => {
    if (totalPaginas <= 1) return null
    
    // Crear un array de números de página para mostrar
    const numerosPagina: number[] = []
    for (let i = 1; i <= totalPaginas; i++) {
      numerosPagina.push(i)
    }

    return (
      <div className="flex justify-center space-x-2 mt-8">
        <button
          onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-4 py-2 border rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        
        {/* Renderizar un máximo de 5-7 botones de página, o manejar de forma más simple */}
        {numerosPagina.map(numero => (
          <button
            key={numero}
            onClick={() => setPaginaActual(numero)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              paginaActual === numero
                ? 'bg-primary text-primary-foreground border-primary' // Estilo activo
                : 'bg-background hover:bg-secondary border-border' // Estilo inactivo
            }`}
          >
            {numero}
          </button>
        ))}

        <button
          onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="px-4 py-2 border rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
        >
          Siguiente
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      
      <RandomBanner productos={bannerProducts} /> 

      <main className="container mx-auto px-4 py-8 pt-20">
        
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
          {productosPaginados.length > 0 ? ( // 6. Usar productosPaginados
            productosPaginados.map((p) => (
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
        
        {/* 7. Agregar el componente de paginación aquí */}
        {filtrados.length > 0 && <Paginacion />}

      </main>

      <footer className="mt-12 bg-secondary text-center text-sm text-foreground/70 py-4 border-t border-border">
        <p>© {new Date().getFullYear()} SoloFarmacias — Proyecto Scraper</p>
      </footer>
    </div>
  )
}