import Link from 'next/link'
import Image from 'next/image'

type Props = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  link: string
  imagen_url?: string | null
  id_medicamento: number
}

export default function ProductoCard({
  nombre,
  precio,
  precio_normal,
  farmacia,
  url,
  link,
  imagen_url,
  id_medicamento
}: Props) {
  const ahorro = precio_normal - precio
  const hayOferta = ahorro > 0

  return (
    <div
      className="bg-secondary/70 backdrop-blur-sm border border-border 
                 rounded-2xl shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:border-primary/60 
                 transition-all duration-300 p-4 flex flex-col justify-between 
                 transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* 🖼 Imagen y nombre */}
      <Link href={link} className="block group">
        <div className="w-full h-40 relative mb-3 overflow-hidden rounded-lg bg-secondary/80 flex items-center justify-center">
          {imagen_url ? (
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              sizes="100%"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-foreground/60 text-sm">
              Sin imagen
            </div>
          )}
        </div>
        <h2
          className="text-base sm:text-lg font-semibold text-primary 
                     group-hover:text-[var(--primary-hover)] transition-colors"
        >
          {nombre}
        </h2>
      </Link>

      {/* 🏪 Detalle del producto */}
      <div className="mt-2 flex-1">
        <p className="text-sm text-foreground/70 mb-1">
          🏥 <strong>{farmacia}</strong>
        </p>

        <p className="text-green-600 font-semibold text-sm sm:text-base">
          💲 Precio Oferta: ${precio.toLocaleString('es-CL')}
        </p>

        <p className="text-sm text-foreground/60 line-through">
          Precio Normal: ${precio_normal.toLocaleString('es-CL')}
        </p>

        {hayOferta && (
          <p className="text-xs text-blue-500 mt-1">
            🔻 Ahorro de ${ahorro.toLocaleString('es-CL')}
          </p>
        )}
      </div>

      {/* 🔗 Enlaces */}
      <div className="mt-3 space-y-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-[var(--primary-hover)] hover:underline transition"
        >
          Ver producto en farmacia
        </a>

        <Link
          href={`/historial/${id_medicamento}`}
          className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition"
        >
          📈 Ver historial de precios
        </Link>
      </div>
    </div>
  )
}
