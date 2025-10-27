// src/pages/quienes-somos.tsx

import Layout from '../components/Layout' // Asegúrate de que este componente exista
import TwoColumnSection from '../components/TwoColumnSection' 

export default function QuienesSomos() {
  
  // Datos de ejemplo para las 4 secciones
  const sections = [
    {
      title: "Nuestra Misión",
      description: "Nuestra misión es empoderar a los consumidores ofreciéndoles acceso transparente e instantáneo a la información de precios de medicamentos en las farmacias de la región. Creemos en el derecho a la información para tomar decisiones informadas sobre la salud y el bolsillo.",
      imageSrc: "/images/mision.jpg", // Asegúrate de que esta ruta exista
      imagePosition: 'left' as const,
    },
    {
      title: "El Equipo Detrás",
      description: "Somos un pequeño pero apasionado equipo de desarrolladores, diseñadores y expertos en salud. Nos mueve la convicción de que la tecnología puede resolver problemas reales. Trabajamos en un entorno ágil y centrado en el usuario para mejorar la plataforma día a día.",
      imageSrc: "/images/equipo.jpg", // Asegúrate de que esta ruta exista
      imagePosition: 'right' as const,
    },
    {
      title: "Compromiso con la Transparencia",
      description: "Garantizamos la integridad y frescura de nuestros datos. Utilizamos tecnología de rastreo avanzada para asegurar que los precios mostrados sean los más actualizados, sin favoritismos ni sesgos, siendo una plataforma completamente independiente de las cadenas de farmacias.",
      imageSrc: "/images/transparencia.jpg", // Asegúrate de que esta ruta exista
      imagePosition: 'left' as const,
    },
    {
      title: "Visión de Futuro",
      description: "Soñamos con un ecosistema de salud donde la búsqueda de precios justos sea un estándar. Queremos expandir nuestra cobertura, integrar más servicios de comparación y ser la herramienta de referencia para cualquier decisión relacionada con la compra de medicamentos.",
      imageSrc: "/images/vision.jpg", // Asegúrate de que esta ruta exista
      imagePosition: 'right' as const,
    },
  ];

  return (
    // Usa el layout principal de la aplicación
    <Layout>
      <main className="container mx-auto px-4 py-8">
        
        {/* Título de la Página (Debajo del header) */}
        <h2 className="text-5xl font-extrabold text-center text-red-700 mt-8 mb-16">
          Quiénes Somos
        </h2>

        {/* --- NOTA: Aquí iría el componente <CarruselOfertas /> si lo tienes --- */}
        
        {/* Genera las 4 secciones alternando */}
        <div className="max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <TwoColumnSection
              key={index}
              title={section.title}
              description={section.description}
              imageSrc={section.imageSrc}
              imagePosition={section.imagePosition}
            />
          ))}
        </div>

        {/* Sección de ayuda para el efecto de desplazamiento */}
        <div id="fade-scroll-hint" className="mt-20 text-center p-4 bg-gray-100 rounded">
            <h3 className="text-xl font-bold mb-2">Sobre el Efecto de Difuminado al Desplazarse</h3>
            <p className="text-gray-700">El efecto de difuminado que buscas (letras que desaparecen al tocar los bordes del scroll) es un efecto visual complejo que no se logra con React o clases básicas de Tailwind. Requiere **CSS personalizado** usando la propiedad <code className="bg-white p-1 rounded font-mono text-sm">mask-image</code> con un degradado. Este efecto es más sencillo de aplicar a un bloque de texto fijo y desplazable que a toda la página.</p>
        </div>

      </main>
    </Layout>
  )
}