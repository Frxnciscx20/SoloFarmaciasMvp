// src/components/RandomBanner.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// === Agrega estas definiciones ===
type Producto = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string | null // Asegúrate de que puede ser null
  id_medicamento: number
}

interface RandomBannerProps {
  productos: Producto[];
}
// =================================

// ... (Definición de tipos y interfaces)

const RandomBanner: React.FC<RandomBannerProps> = ({ productos }) => {
  if (productos.length === 0) return null;

  return (
    // 1. CONTENEDOR PRINCIPAL DEL BANNER
    // Usamos bg-secondary/80 para un fondo que contraste sutilmente con bg-background, 
    // y border-b border-border para que luzca limpio en ambos modos.
    <div className="w-full bg-secondary/80 py-4 shadow-md mb-8 transition-colors duration-300 border-b border-border">
      <div className="container mx-auto px-4">
        
        {/* 2. TÍTULO DEL BANNER */}
        {/* Usamos text-primary, que ya se adapta al tema (p. ej., azul en claro, amarillo en oscuro). */}
        <h3 className="text-center text-lg font-bold text-primary mb-3 transition-colors duration-300">
          🔥🔥🔥 Productos destacados 🔥🔥🔥
        </h3>
        
        {/* Contenedor con scroll horizontal */}
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide"> 
          {productos.map((p) => (
            <Link 
              href={`/producto/${p.id_medicamento}`}
              key={p.id_medicamento} 
              // 3. TARJETA DE PRODUCTO
              // Usamos bg-background para el fondo de la tarjeta y border-border para un borde sutil.
              className="flex-shrink-0 w-32 p-2 bg-background rounded-lg shadow-md hover:shadow-lg transition cursor-pointer duration-300 border border-border"
            >
              {p.imagen_url && (
                <div className="relative w-full h-20 mb-2">
                  <Image
                    src={p.imagen_url}
                    alt={p.nombre}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
              {/* 4. NOMBRE DEL PRODUCTO */}
              {/* Usamos text-foreground para el texto principal. */}
              <p className="text-xs font-medium text-foreground truncate">{p.nombre}</p>
              
              {/* 5. PRECIO EN OFERTA (Mantenemos el rojo, que funciona en ambos modos) */}
              <p className="text-xs font-bold text-red-600">
                ${p.precio.toFixed(0)}
              </p>
              
              {/* 6. PRECIO NORMAL TACHADO */}
              {/* Usamos text-foreground/50 para que sea un texto secundario y temático. */}
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