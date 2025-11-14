import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductoCard from '../components/ProductoCard'
import Filtros from '../components/Filtros'
import Navbar from '../components/Navbar'
import RandomBanner from '../components/RandomBanner'

type Producto = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string
  id_medicamento: number
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function getServerSideProps() {
  const { data: productos } = await supabase.from('vista_productos').select('*')
  const allProducts = productos || []

  const bannerProducts = getRandomItems(allProducts, 10)

  return { 
    props: { 
      productos: allProducts,
      bannerProducts
    } 
  }
}

type HomeProps = { 
  productos: Producto[];
  bannerProducts: Producto[]; 
}

export default function Home({ productos, bannerProducts }: HomeProps) {

  const [busqueda, setBusqueda] = useState('')
  const [farmacia, setFarmacia] = useState('')

  const [paginaActual, setPaginaActual] = useState(1)
  const productosPorPagina = 12

  const filtrados = useMemo(() => {
    setPaginaActual(1)
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (farmacia === '' || p.farmacia.toLowerCase().includes(farmacia.toLowerCase()))
    )
  }, [productos, busqueda, farmacia])

  const totalPaginas = Math.ceil(filtrados.length / productosPorPagina)
  const indiceFinal = paginaActual * productosPorPagina
  const indiceInicial = indiceFinal - productosPorPagina
  const productosPaginados = filtrados.slice(indiceInicial, indiceFinal)

  const Paginacion = () => {
    if (totalPaginas <= 1) return null

    const numerosPagina = []
    for (let i = 1; i <= totalPaginas; i++) numerosPagina.push(i)

    return (
      <div className="flex justify-center flex-wrap gap-2 mt-8">
        <button
          onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="px-4 py-2 border rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>

        {numerosPagina.map(numero => (
          <button
            key={numero}
            onClick={() => setPaginaActual(numero)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              paginaActual === numero
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-secondary border-border'
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
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      
      <Navbar />
      <RandomBanner productos={bannerProducts} />

      {/* MAIN RESPONSIVE */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        <Filtros
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          farmacia={farmacia}
          setFarmacia={setFarmacia}
        />

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {productosPaginados.length > 0 ? (
            productosPaginados.map((p) => (
              <ProductoCard key={p.id_medicamento} {...p} link={`/producto/${p.id_medicamento}`} />
            ))
          ) : (
            <p className="text-center col-span-full text-foreground/70">
              No se encontraron resultados.
            </p>
          )}
        </div>

        {filtrados.length > 0 && <Paginacion />}

      </main>

      <footer className="mt-12 bg-secondary text-center text-sm text-foreground/70 py-4 border-t border-border">
        <p>© {new Date().getFullYear()} SoloFarmacias — Proyecto Scraper</p>
      </footer>
    </div>
  )
}
