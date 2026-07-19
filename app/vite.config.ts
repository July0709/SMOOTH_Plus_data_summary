import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 构建时（GitHub Pages 项目站点）使用仓库子路径；
  // 本地开发（npm run dev）保持 /，预览不受影响
  base: command === 'build' ? '/SMOOTH_Plus_data_summary/' : '/',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
