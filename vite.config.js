import { defineConfig } from 'vite'

import { resolve } from 'path'

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
                login: resolve(__dirname, 'login.html'),
                materials: resolve(__dirname, 'materials.html'),
                profile: resolve(__dirname, 'profile.html'),
                register: resolve(__dirname, 'register.html'),
                team: resolve(__dirname, 'team.html'),
                team_directory: resolve(__dirname, 'team_directory.html')
            }
        }
    }
})
