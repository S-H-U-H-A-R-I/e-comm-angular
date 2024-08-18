/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

const addUtilities = plugin(function ({ addUtilities }) {
    addUtilities({
        '.full-center': {
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
})


const config = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts,component.html,component.ts}"
    ],
    theme: {
        extend: {
            colors: {
                'theme-black': '#1E201E',
                'theme-green': '#697565',
                'theme-green-100': '#3C3D37',
                'theme-beige': '#ECDFCC',
                'theme-beige-lighter': '#f8f4ed'
            }
        },
    },
    plugins: [
        addUtilities
    ],
}

export default config