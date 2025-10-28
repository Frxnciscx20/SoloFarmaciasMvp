// src/pages/quienes-somos.tsx

import Navbar from '../components/Navbar';
import TwoColumnSection from '../components/TwoColumnSection' 
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link'; 
import Image from 'next/image'; 
//import RandomBanner from '../components/RandomBanner';

// ============================================
// 1. TIPOS Y LÓGICA DEL SERVIDOR (getServerSideProps)
// ============================================

// Define el tipo Producto
type Producto = {
  nombre: string
  precio: number
  precio_normal: number
  farmacia: string
  url: string
  imagen_url?: string
  id_medicamento: number
}

// Función de utilidad para obtener N elementos aleatorios
function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Obtener datos de productos en el servidor
export async function getServerSideProps() {
  const { data: productos } = await supabase.from('vista_productos').select('*');
  
  const allProducts = productos || [];
  
  // Selecciona 10 productos aleatorios para el banner
  const bannerProducts = getRandomItems(allProducts, 10); 

  return { 
    props: { 
      bannerProducts: bannerProducts
    } 
  }
}

// Define el tipo de las props del componente principal
type QuienesSomosProps = {
    bannerProducts: Producto[]; 
}

// ============================================
// 2. COMPONENTE PRINCIPAL
// ============================================

export default function QuienesSomos({ bannerProducts }: QuienesSomosProps) {
  
  // Datos de ejemplo para las 4 secciones
  const sections = [
    {
      title: "Nuestra Misión",
      description: "Nuestra misión es empoderar a los consumidores ofreciéndoles acceso transparente e instantáneo a la información de precios de medicamentos en las farmacias de la región. Creemos en el derecho a la información para tomar decisiones informadas sobre la salud y el bolsillo.",
      imageSrc: "/images/logo.png", 
      imagePosition: 'left' as const,
    },
    {
      title: "Nuestro equipo",
      description: "Somos un pequeño pero apasionado equipo de desarrolladores, diseñadores y expertos en salud. Nos mueve la convicción de que la tecnología puede resolver problemas reales. Trabajamos en un entorno ágil y centrado en el usuario para mejorar la plataforma día a día.",
      imageSrc: "/images/equipo_propio.png", 
      imagePosition: 'right' as const,
    },
    {
      title: "Compromiso con la Transparencia",
      description: "Garantizamos la integridad y frescura de nuestros datos. Utilizamos tecnología de rastreo avanzada para asegurar que los precios mostrados sean los más actualizados, sin favoritismos ni sesgos, siendo una plataforma completamente independiente de las cadenas de farmacias.",
      imageSrc: "/images/compromiso.png", 
      imagePosition: 'left' as const,
    },
    {
      title: "Visión de Futuro",
      description: "Soñamos con un ecosistema de salud donde la búsqueda de precios justos sea un estándar. Queremos expandir nuestra cobertura, integrar más servicios de comparación y ser la herramienta de referencia para cualquier decisión relacionada con la compra de medicamentos.",
      imageSrc: "/images/equipo_pastillas.png", 
      imagePosition: 'right' as const,
    },
  ];

  return (
    // Fondo de la página y colores de texto adaptados al tema y modo oscuro
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

     {/* Banner de Productos Aleatorios */}
      {/* <RandomBanner productos={bannerProducts} /> */}
      
      <main className="container mx-auto px-4 py-8">
        
        {/* Título de la Página (Agrandado y con estilo de nube) */}
        <div className="flex justify-center mt-8 mb-16">
            <h2 className="text-6xl font-bold text-blue-500 
                    p-6 rounded-3xl shadow-xl inline-block">
        
        {/* MODIFICACIÓN AQUÍ: Encerrar los emojis en un <span> con una clase de texto más pequeña */}
        <span className="text-4xl mr-4">💊</span> {/* Reducido de 7xl a 6xl y margen derecho */}
        Quiénes Somos
        <span className="text-4xl ml-4">💊</span> {/* Reducido de 7xl a 6xl y margen izquierdo */}
        
    </h2>
        </div>
        
        {/* Genera las 4 secciones alternando */}
        <div className="max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <TwoColumnSection
              key={index}
              title={section.title}
              description={section.description}
              imageSrc={section.imageSrc}
              imagePosition={section.imagePosition}
              titleColor={'text-blue-400'}
            />
          ))}
        </div>

      </main>
      
      {/* Footer idéntico al de index.tsx */}
      <footer className="mt-12 bg-secondary text-center text-sm text-foreground/70 py-4 border-t border-border">
        <p>© {new Date().getFullYear()} SoloFarmacias — Proyecto Scraper</p>
      </footer>
    </div>
  )
}