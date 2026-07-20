import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // All component files in this project use the .js extension (not .jsx).
  // Vite's esbuild transform only enables JSX parsing for .jsx/.tsx by
  // default, so we tell it to treat .js under src/ as JSX too, both for
  // the normal transform pipeline and for dependency pre-bundling.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
