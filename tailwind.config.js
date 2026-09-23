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
                "primary": "#0df259",
                "background-light": "#102216", // Force dark even on light mode fallback
                "background-dark": "#102216",
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
