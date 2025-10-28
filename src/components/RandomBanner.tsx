// // src/components/RandomBanner.tsx

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// // Definición de tipos para el producto (debe coincidir con tu index.tsx)
// type Producto = {
//   nombre: string
//   precio: number
//   precio_normal: number
//   farmacia: string
//   imagen_url?: string
//   id_medicamento: number
//   link: string // Asumiendo que has añadido esta propiedad al mapeo
// }

// interface RandomBannerProps {
//   productos: Producto[];
// }

// const RandomBanner: React.FC<RandomBannerProps> = ({ productos }) => {
//   if (productos.length === 0) return null;

//   return (
//     // Banner con fondo suave y sombra
//     <div className="w-full bg-blue-50 py-4 shadow-sm mb-8">
//       <div className="container mx-auto px-4">
//         <h3 className="text-center text-lg font-bold text-blue-500 mb-3">
//           🔥🔥🔥 Productos destacados 🔥🔥🔥
//         </h3>
        
//         {/* Contenedor con scroll horizontal para mostrar los 10 productos */}
//         <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide"> 
//           {productos.map((p) => (
//             <Link 
//               href={`/producto/${p.id_medicamento}`} // Ajusta la ruta si es necesario
//               key={p.id_medicamento} 
//               className="flex-shrink-0 w-32 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
//             >
//               {p.imagen_url && (
//                 <div className="relative w-full h-20 mb-2">
//                   <Image
//                     src={p.imagen_url}
//                     alt={p.nombre}
//                     layout="fill"
//                     objectFit="contain"
//                     // Nota: El dominio de la imagen debe estar configurado en next.config.js
//                   />
//                 </div>
//               )}
//               <p className="text-xs font-medium text-gray-800 truncate">{p.nombre}</p>
//               <p className="text-xs font-bold text-red-600">${p.precio.toLocaleString('es-CL')}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RandomBanner;