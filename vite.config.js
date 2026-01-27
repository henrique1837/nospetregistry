import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Proxy requests starting with '/api/blossom' to the Blossom server
      '/api/blossom': {
        target: 'https://blossom.primal.net',
        changeOrigin: true, // Needed for virtual hosted sites
        headers: {
          'Access-Control-Allow-Origin': '*', // This might help, though `changeOrigin` should handle it
          // You might need to add other headers explicitly if Blossom is very strict
        },
        // The `rewrite` rule is correct for removing `/api/blossom`
        rewrite: (path) => path.replace(/^\/api\/blossom/, ''),

        // Add a `configure` function to inspect/modify the proxy request
        // This can be very useful for debugging!
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path);
            console.log('Original headers from client:', req.headers);
            console.log('Headers sent to target:', proxyReq.getHeaders());
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  }
})
