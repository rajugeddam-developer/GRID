import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                activities: resolve(__dirname, 'activities.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                events: resolve(__dirname, 'events.html'),
                materials: resolve(__dirname, 'materials.html'),
                team: resolve(__dirname, 'team.html'),
                team_directory: resolve(__dirname, 'team_directory.html')
            }
        }
    }
})
