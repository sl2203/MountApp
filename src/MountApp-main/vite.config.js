import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
    },
    server: {
        port: 5173,
        proxy: {
            // 1. 백엔드 (Spring Boot) 연결
            "/api": {
                target: "http://localhost:8082",
                changeOrigin: true,
                secure: false,
            },

            // 2. [추가됨] 공공데이터포털 (산림청 산불/산사태 정보)
            // 브라우저에서 '/public-api'로 요청하면 -> 'http://apis.data.go.kr'로 보내줍니다.
            "/public-api": {
                target: "http://apis.data.go.kr",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/public-api/, ""),
            },

            // 3. 기존 안전데이터 (혹시 사용하신다면 유지)
            "/safety": {
                target: "https://www.safetydata.go.kr",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/safety/, ""),
            },

            // 4. 날씨 API
            "/weather-api": {
                target: "https://api.openweathermap.org",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/weather-api/, ""),
            },
        },
    },
});