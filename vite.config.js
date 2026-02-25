import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                activities: 'activities.html',
                dashboard: 'dashboard.html',
                events: 'events.html',
                login: 'login.html',
                materials: 'materials.html',
                profile: 'profile.html',
                register: 'register.html',
                team: 'team.html',
                team_directory: 'team_directory.html'
            }
        }
    }
})
