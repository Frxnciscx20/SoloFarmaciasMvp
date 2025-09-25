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
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">
      <Link href={link} className="block">
        <div className="w-full h-40 relative mb-2 overflow-hidden rounded">
          {imagen_url ? (
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              sizes="100%"
              className="object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Sin imagen
            </div>
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
