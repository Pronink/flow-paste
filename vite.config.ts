import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const BASE = '/flow-paste/'

/**
 * `avoid-nodes-edge` hardcodes the WASM path as `origin + "/libavoid.wasm"`
 * (both in the main module and in its web worker), ignoring Vite's `base`
 * setting. This rewrites that literal at build time so it points to the
 * deployment base path. The library prepends the origin when the path starts
 * with "/", so `${BASE}libavoid.wasm` resolves to
 * `https://<host>/flow-paste/libavoid.wasm`.
 *
 * The WASM file is already served from that location
 * (`public/libavoid.wasm` -> `docs/libavoid.wasm`), so no post-build step is
 * required to move the file.
 */
function fixLibavoidWasmPath(base: string): Plugin {
  return {
    name: 'fix-libavoid-wasm-path',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('avoid-nodes-edge')) return null
      if (!code.includes('/libavoid.wasm')) return null
      return {
        code: code.replaceAll('/libavoid.wasm', `${base}libavoid.wasm`),
        map: null,
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), fixLibavoidWasmPath(BASE)],
  build: {
    outDir: 'docs',
  },
  worker: {
    format: 'es',
    plugins: () => [fixLibavoidWasmPath(BASE)],
    rollupOptions: {
      output: { entryFileNames: '[name].js' },
    },
  },
  optimizeDeps: {
    exclude: ['avoid-nodes-edge'],
  },
})
