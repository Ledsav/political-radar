/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // GitHub Pages serves the site from /<repo>/; the deploy workflow sets
    // BASE_PATH. Local dev and other hosts use the root.
    base: process.env.BASE_PATH || '/',
    plugins: [react()],
    build: {outDir: 'build'},
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
    },
});
