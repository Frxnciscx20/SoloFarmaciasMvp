// src/components/Filtros.tsx

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
    <div className="w-full flex justify-center mt-4 mb-8 px-3 md:px-4">

      {/* CONTENEDOR RESPONSIVE */}
      <div className="
        flex flex-wrap                 /* 💚 Permite 2 líneas en móvil */
        w-full max-w-4xl               /* 💚 No crece más del viewport */
        bg-secondary/60 backdrop-blur-sm 
        border border-border rounded-lg shadow-sm 
        p-3 gap-3 transition-colors
      ">

        {/* Input (SIEMPRE full width en mobile) */}
        <input
          type="text"
          placeholder="🔍 Buscar medicamento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="
            flex-1 w-full                /* 💚 OBLIGADO: evita overflow */
            bg-transparent text-foreground 
            placeholder-foreground/50 
            border-none outline-none 
            px-3 py-2 rounded-md 
            focus:ring-2 focus:ring-primary
          "
        />

        {/* Select farmacia (se mueve abajo en móvil) */}
        <select
          value={farmacia}
          onChange={(e) => setFarmacia(e.target.value)}
          className="
            w-full sm:w-auto             /* 💚 En móvil ocupa toda la fila */
            bg-background text-foreground 
            border border-border rounded-md 
            px-3 py-2 shadow-sm 
            hover:border-primary 
            focus:outline-none focus:ring-2 focus:ring-primary 
            transition
          "
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
