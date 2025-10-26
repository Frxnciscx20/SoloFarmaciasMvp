type Props = {
  busqueda: string
  setBusqueda: (value: string) => void
  farmacia: string
  setFarmacia: (value: string) => void
}

export default function Filtros({
  busqueda,
  setBusqueda,
  farmacia,
  setFarmacia
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-4 mb-8 px-4">
      {/* Contenedor visual moderno */}
      <div className="flex w-full md:w-3/4 lg:w-2/3 bg-secondary/60 backdrop-blur-sm border border-border rounded-lg shadow-sm p-2 md:p-3 gap-2 transition-colors">

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="🔍 Buscar medicamento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 bg-transparent text-foreground placeholder-gray-500 border-none outline-none px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
        />

        {/* Select farmacia */}
        <select
          value={farmacia}
          onChange={(e) => setFarmacia(e.target.value)}
          className="min-w-[160px] md:min-w-[200px] bg-secondary text-foreground border border-border rounded-md px-3 py-2 shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          <option value="">Todas las farmacias</option>
          <option value="Ahumada">Ahumada</option>
          <option value="Salcobrand">Salcobrand</option>
          <option value="Cruz Verde">Cruz Verde</option>
        </select>
      </div>
    </div>
  )
}
