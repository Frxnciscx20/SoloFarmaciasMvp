import Link from 'next/link'

type Props = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  link: string
  imagen_url?: string | null  // ✅ Cambiado aquí
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
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">
      <Link href={link} className="block">
        <div className="w-full h-40 flex items-center justify-center mb-2 overflow-hidden rounded">
          {imagen_url ? (
            <img
              src={imagen_url}
              alt={nombre}
              className="object-contain h-full w-full"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-sm">Sin imagen</div>
          )}
        </div>
        <h2 className="text-lg font-bold text-red-600 mb-1 hover:underline">{nombre}</h2>
      </Link>

      <p className="text-sm text-gray-500">Farmacia: {farmacia}</p>
      <p className="text-green-600 font-semibold">💲 Precio Oferta: ${precio}</p>
      <p className="text-sm text-gray-500 line-through">Precio Normal: ${precio_normal}</p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
      >
        Ver producto en farmacia
      </a>

      <Link
        href={`/historial/${id_medicamento}`}
        className="text-sm text-red-500 hover:underline mt-2 block"
      >
        📈 Ver historial de precios
      </Link>
    </div>
  )
}
