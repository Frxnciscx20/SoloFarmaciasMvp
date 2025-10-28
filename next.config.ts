/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: [
      'www.farmaciasahumada.cl',
      'www.cruzverde.cl',
      'beta.cruzverde.cl', // ✅ agregado
      'www.farmaciasimi.cl',
      'static.salcobrandonline.cl',
      'via.placeholder.com',
      'your-supabase-url.supabase.co'
    ],
  },
}

module.exports = nextConfig;
