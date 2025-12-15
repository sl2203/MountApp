// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist", // 빌드 결과물 디렉토리
    },
    server: {
        port: 5173, // 개발 서버 포트
        proxy: {
            // 1. 백엔드 (Spring Boot) 연결
            "/api": {
                target: "http://localhost:8082",
                changeOrigin: true,
                secure: false,
            },

            // 2. 공공데이터포털 (산불/산사태 정보)
            // 브라우저에서 '/public-api'로 요청하면 -> 'https://apis.data.go.kr'로 프록시
            "/public-api": {
                target: "https://apis.data.go.kr",
                changeOrigin: true,
                secure: false, // 개발 환경만 false
                rewrite: (path) => path.replace(/^\/public-api/, ""),
            },

            // 3. 기존 안전데이터 (필요 시 유지)
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
