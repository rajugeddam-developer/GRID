export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.html",
    ],
    theme: {
        extend: {
            colors: {
                grid: {
                    blue: '#3b82f6',
                    emerald: '#10b981',
                    bg: '#111827',
                    card: '#1f2937'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
