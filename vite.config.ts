import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { TanStackRouterVite } from '@tanstack/router-plugin/src/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        react(),
        svgr({
            include: '**/*.svg?react',
        }),
    ],
});
