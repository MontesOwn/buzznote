import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
// import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "index.html"),
    //   },
    // },
  },
  plugins: [VitePWA({
    registerType: "autoUpdate",
      injectRegister: "auto",

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Buzznote',
      short_name: 'buzznote',
      description: '',
      theme_color: '#f2a007',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      ignoreURLParametersMatching: [/^year$/, /^author$/, /^tag$/, /^utm_/, /^fbclid$/],
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})
