import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8989,
    watch: {
      usePolling: true, // 파일 변경 감지를 위해 폴링 사용
    },
    hmr: {
      protocol: 'ws', // HMR을 WebSocket으로 활성화
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8988",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1/service'),
      }
    }
  },
})
