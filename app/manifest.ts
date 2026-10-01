import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'El Bodegoncito Viandas',
    short_name: 'Bodegoncito',
    description: 'Comida casera, abundante y nutritiva. Un solo menu por día.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8f3',
    theme_color: '#173f2a',
    orientation: 'portrait',
    lang: 'es-AR',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
