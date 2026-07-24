import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // GitHub repository name
  base: "/GoogleKeepCloneReact/",

  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});