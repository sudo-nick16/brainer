/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'text': '#fde7e7',
                'background': '#050505',
                'primary': '#b32100',
                'secondary': '#1a1a19',
                'accent': '#ff542e',
            },
        },
    },
    plugins: [],
}

