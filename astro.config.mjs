import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.concierge-ai.fr',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // L'ancienne adresse de la page garage est conservée : 60 liens du site
  // pointaient déjà vers /metiers/garage-carrosserie, qui renvoyait une 404.
  redirects: {
    '/garage-carrosserie': { status: 301, destination: '/metiers/garage-carrosserie' },
  },
  integrations: [sitemap()],
})
