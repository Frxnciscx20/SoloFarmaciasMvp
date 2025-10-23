type Props = {
  busqueda: string
  setBusqueda: (value: string) => void
  farmacia: string
  setFarmacia: (value: string) => void
}

export default function Filtros({ busqueda, setBusqueda, farmacia, setFarmacia }: Props) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar medicamento..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border border-border bg-white text-gray-800 
                   dark:bg-[var(--secondary)] dark:text-gray-100 
                   p-2 rounded-md w-full shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Selector de farmacia */}
      <select
        value={farmacia}
        onChange={(e) => setFarmacia(e.target.value)}
        className="border border-border bg-white text-gray-800 
                   dark:bg-[var(--secondary)] dark:text-gray-100 
                   p-2 rounded-md w-full shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Todas las farmacias</option>
        <option value="Ahumada">Ahumada</option>
        <option value="Salcobrand">Salcobrand</option>
        <option value="Cruz Verde">Cruz Verde</option>
      </select>
    </div>
  )
}
