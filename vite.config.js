import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				aboutme: './aboutme.html',
				photos: './photos.html',
				resume: './resume.html',
				contactme: './contactme.html',
				projects: './projects.html',
				rubikscube: './rubikscube.html'
			}
		}
	},
	base: "/"
})