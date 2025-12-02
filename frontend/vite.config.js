import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT || 3000;

export default defineConfig({
    plugins: [react()],
    server: {
        port,
        host: '0.0.0.0',
        watch: {
            usePolling: true,
        },
        allowedHosts: ['wrinkleable-sherley-unsulkily.ngrok-free.dev'],
        proxy: {
            "/api": {
                target: "http://backend:8080",  //  talk to backend container
                changeOrigin: true,
            },
        },
    },
});