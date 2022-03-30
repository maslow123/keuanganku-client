module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {      
      'xss': {'max': '470px'},
      // => @media (max-width: 470px) { ... }
      'xs': {'max': '640px'},
      // => @media (max-width: 640px) { ... }
      'sm': {'min': '640px', 'max': '767px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '1024px', 'max': '1279px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': {'min': '1536px'},
      // => @media (min-width: 1536px) { ... }
      // =============== FOR DEVICE ===================
      'tablet': {'max': '640px'},
      // => @media (max-width: 640px) { ... }

      'laptop': {'max': '1024px'},
      // => @media (max-width: 1024px) { ... }

      'desktop': {'max': '1280px'},
      // => @media (max-width: 1280px) { ... }
    },
    extend: {
      maxWidth: {
        "8xl": "1920px"
      },
      colors: {
        primary: 'var(--primary)',
        'primary-2': 'var(--primary-2)',
        secondary: 'var(--secondary)',
        'secondary-2': 'var(--secondary-2)',
        hover: 'var(--hover)',
        'hover-1': 'var(--hover-1)',
        'hover-2': 'var(--hover-2)',
        'accents-0': 'var(--accents-0)',
        'accents-1': 'var(--accents-1)',
        'accents-2': 'var(--accents-2)',
        'accents-3': 'var(--accents-3)',
        'accents-4': 'var(--accents-4)',
        'accents-5': 'var(--accents-5)',
        'accents-6': 'var(--accents-6)',
        'accents-7': 'var(--accents-7)',
        'accents-8': 'var(--accents-8)',
        'accents-9': 'var(--accents-9)',
        violet: 'var(--violet)',
        'violet-light': 'var(--violet-light)',
        pink: 'var(--pink)',
        cyan: 'var(--cyan)',
        // blue: 'var(--blue)',
        // green: 'var(--green)',
        // red: 'var(--red)',
        
        'red': '#FFC2C7',
        'green': '#B6E5D8',
        'yellow': '#FBE5C8',
        'blue': '#8FDDE7',
        rose: '#F7D4E0',
        pink: '#FD7AC0',
        blue: '#7AD7F0',
        turquoise: '#44C8E0'
      },
      textColor: {
        base: 'var(--text-base)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      }
    },
  },
  plugins: [],
}
