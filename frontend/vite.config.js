import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const port = process.env.PORT || 3000; 
export default defineConfig({
  plugins: [react()],
  server : {
  port: port, 
  host: '0.0.0.0',
  watch: {
    usePolling: true,
  },
  allowedHosts : ['wrinkleable-sherley-unsulkily.ngrok-free.dev']
}
})
