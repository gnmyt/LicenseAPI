import {defineConfig} from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@contexts": path.resolve(__dirname, "./src/common/contexts"),
            "@components": path.resolve(__dirname, "./src/common/components"),
            "@states": path.resolve(__dirname, "./src/states"),
            "@": path.resolve(__dirname, "./src"),
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8025"
            }
        }
    }
});