// src/components/RandomBanner.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Producto = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string | null
  id_medicamento: number
}

interface RandomBannerProps {
  productos: Producto[];
}

const RandomBanner: React.FC<RandomBannerProps> = ({ productos }) => {
  if (productos.length === 0) return null;

  return (
    <div className="w-full bg-secondary/80 py-4 shadow-md mb-8 transition-colors duration-300 border-b border-border">

      {/* CONTENEDOR RESPONSIVE */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">

        {/* Título */}
        <h3 className="text-center text-lg font-bold text-primary mb-3 transition-colors duration-300">
          🔥🔥🔥 Productos destacados 🔥🔥🔥
        </h3>

        {/* SCROLL HORIZONTAL */}
        <div
          className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide w-full"
        >
          {productos.map((p) => (
            <Link
              href={`/producto/${p.id_medicamento}`}
              key={p.id_medicamento}
              className="
                flex-shrink-0 
                min-w-[120px] sm:min-w-[140px] 
                p-2 bg-background rounded-lg shadow-md 
                hover:shadow-lg transition duration-300 
                cursor-pointer border border-border
              "
            >
              {p.imagen_url && (
                <div className="relative w-full h-20 mb-2">
                  <Image
                    src={p.imagen_url}
                    alt={p.nombre}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <p className="text-xs font-medium text-foreground truncate">
                {p.nombre}
              </p>

              <p className="text-xs font-bold text-red-600">
                ${p.precio.toFixed(0)}
              </p>

              <p className="text-xs text-foreground/50 line-through">
                ${p.precio_normal.toFixed(0)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomBanner;
