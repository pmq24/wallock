import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    allowedHosts: ['app-dev.wallock.xyz'],
    cors: { origin: ['http://sync-dev.wallock.xyz:3000'] },
    host: true,
    port: 3100,
  },
})
