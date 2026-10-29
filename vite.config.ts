import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: 'src/client',
    build: {
        outDir: '../../dist/public',
        emptyOutDir: true,
    },
    server: {
        // Forward WebSocket traffic to the Express server
        proxy: {
            '/ws': { target: `ws://localhost:${process.env.PORT || 3000}`, ws: true },
        },
    },
});
