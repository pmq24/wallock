import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    // Why `loose`?
    // https://github.com/aleclarson/vite-tsconfig-paths#%EF%B8%8F-non-typescript-modules-need-special-configuration
    tsconfigPaths({ loose: true }),
  ],
  server: {
    host: true,
    https: {
      cert: fs.readFileSync('./localhost.pem'),
      key: fs.readFileSync('./localhost-key.pem'),
    },
    port: 3100,
  },
})
