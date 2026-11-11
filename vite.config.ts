import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { invitation } from './src/config/invitation.ts'

const escapeAttribute = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'invitation-social-metadata',
      transformIndexHtml(html) {
        const { siteUrl, shareImageUrl } = invitation
        const image = siteUrl ? new URL(shareImageUrl, siteUrl).href : shareImageUrl
        const twitterImage = { tag: 'meta', attrs: { name: 'twitter:image', content: image } }
        const canonical = { tag: 'meta', attrs: { property: 'og:url', content: siteUrl } }
        return {
          html: html.replace('content="/social-preview.png"', () => `content="${escapeAttribute(image)}"`),
          tags: siteUrl ? [twitterImage, canonical] : [twitterImage],
        }
      },
    },
  ],
})
