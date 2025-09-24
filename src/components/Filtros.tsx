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
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <input
        type="text"
        placeholder="Buscar medicamento..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full shadow-sm focus:outline-none focus:ring focus:border-red-500"
      />

      <select
        value={farmacia}
        onChange={(e) => setFarmacia(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full shadow-sm focus:outline-none focus:ring focus:border-red-500"
      >
        <option value="">Todas las farmacias</option>
        <option value="Ahumada">Ahumada</option>
        <option value="Salcobrand">Salcobrand</option>
        <option value="Cruz Verde">Cruz Verde</option>
      </select>
    </div>
  )
}
