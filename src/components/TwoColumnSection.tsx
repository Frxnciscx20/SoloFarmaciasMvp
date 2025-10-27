// src/components/TwoColumnSection.tsx

import React from 'react';
import Image from 'next/image';

interface TwoColumnSectionProps {
  imageSrc: string;
  title: string;
  description: string;
  imagePosition: 'left' | 'right';
  // Si necesitas un color diferente para el título de la sección:
  titleColor?: string; 
}

const TwoColumnSection: React.FC<TwoColumnSectionProps> = ({
  imageSrc,
  title,
  description,
  imagePosition,
  titleColor = 'text-red-600'
}) => {
  
  // Determina el orden de las columnas: La imagen es la primera (order-1) si la posición es 'left', 
  // y la segunda (order-2) si es 'right'. En móviles (sin prefijo md:), el orden es siempre el mismo.
  const imageOrder = imagePosition === 'left' ? 'md:order-1' : 'md:order-2';
  const textOrder = imagePosition === 'left' ? 'md:order-2' : 'md:order-1';

  return (
    // Contenedor principal: flex en columnas para móvil, flex en fila para desktop
    <div className="flex flex-col md:flex-row items-center justify-between my-12 py-8 border-b border-gray-200 last:border-b-0">
      
      {/* Columna de la Imagen */}
      <div className={`w-full md:w-5/12 p-4 ${imageOrder}`}>
        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-xl">
          {/* Usamos el componente Image de Next.js. Asegúrate de tener las imágenes en la carpeta /public */}
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            priority // Para cargar las primeras imágenes más rápido
            className="transition duration-500 ease-in-out transform hover:scale-105"
          />
        </div>
      </div>
      
      {/* Columna del Texto */}
      <div className={`w-full md:w-6/12 p-4 ${textOrder}`}>
        <h3 className={`text-3xl font-semibold mb-4 ${titleColor}`}>{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </div>
      
    </div>
  );
};

export default TwoColumnSection;