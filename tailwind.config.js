/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Theme colors are CSS variables (see src/index.css) so the `theme` command can swap them
                "primary": "rgb(var(--color-primary) / <alpha-value>)",
                "background-light": "rgb(var(--color-background) / <alpha-value>)", // Force dark even on light mode fallback
                "background-dark": "rgb(var(--color-background) / <alpha-value>)",
                "chrome": "rgb(var(--color-chrome) / <alpha-value>)",
                "terminal-black": "#0c0c0c",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "mono": ["Space Mono", "monospace"],
            },
            animation: {
                blink: 'blink 1s step-end infinite',
                scanline: 'scanline 8s linear infinite',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                scanline: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
            },
        },
    },
    plugins: [],
}
