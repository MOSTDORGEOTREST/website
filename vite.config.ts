import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), svgr()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	// Документы прайса/протоколов трактуем как статические ассеты (URL-импорт).
	assetsInclude: ['**/*.pdf', '**/*.xlsx'],
	build: {
		// Оставляем папку сборки `build/`, чтобы текущий Dockerfile/Nginx не менять.
		outDir: 'build',
		chunkSizeWarningLimit: 1500,
	},
	server: {
		host: true,
		port: 3000,
	},
})
