/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: [
      'www.farmaciasahumada.cl',
      'www.cruzverde.cl',
      'www.farmaciasimi.cl',
      'static.salcobrandonline.cl', // ✅ nuevo dominio agregado
      'via.placeholder.com',
      'your-supabase-url.supabase.co' // reemplázalo con tu dominio real de supabase
    ],
  },
}

module.exports = nextConfig
