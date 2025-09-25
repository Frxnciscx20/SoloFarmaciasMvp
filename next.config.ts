/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    domains: [
      'www.farmaciasahumada.cl',
      'www.cruzverde.cl',
      'www.farmaciasimi.cl',
      'via.placeholder.com'
    ],
  },
}

module.exports = nextConfig
