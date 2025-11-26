import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
    },
    server: {
        proxy: {

            "/api": {
                target: "http://localhost:8082", // 백엔드 포트 8082 (application.properties와 일치해야 함)
                changeOrigin: true,
                secure: false,


            },

            // (기존 safetydata가 필요하다면 다른 주소로 분리해야 합니다. 예: /safety)
            /* "/safety": {
              target: "https://www.safetydata.go.kr",
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/safety/, ""),
            },
            */
        },
    },
});