import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Podcastify",
        short_name: "Podcasts",
        description: "Descubrí y escuchá tus podcasts favoritos",
        theme_color: "#0F0F2D",
        background_color: "#0F0F2D",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg}"],
        runtimeCaching: [
          {
            urlPattern: /api\/podcastindex\/podcasts/,
            handler: "NetworkFirst",
            options: {
              cacheName: "podcast-list",
              expiration: {
                maxAgeSeconds: 60 * 60,
              },
            },
          },
          {
            urlPattern: /api\/podcastindex\/episodes/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "episodes-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:mp3|m4a)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api/podcastindex": {
        target: "https://api.podcastindex.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/podcastindex/, ""),
        secure: true,
      },
    },
  },
});
