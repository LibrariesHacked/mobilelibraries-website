import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build'
    },
    resolve: {
      alias: {
        '@geovation/gb-name-index': fileURLToPath(
          new URL(
            './node_modules/@geovation/gb-name-index/src/index.js',
            import.meta.url
          )
        )
      }
    },
    plugins: [react()],
    assetsInclude: ['**/*.md']
  }
})
