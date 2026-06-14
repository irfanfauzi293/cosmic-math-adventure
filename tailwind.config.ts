import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        background: '#0d1228',
        surface: '#0d1228',
        'surface-container-low': '#151a31',
        'surface-container': '#1d2239',
        'surface-container-high': '#272c43',
        'surface-container-highest': '#333850',
        
        primary: '#00f2ff',
        'primary-container': '#004e54',
        'on-primary': '#00373a',
        
        secondary: '#4ce346',
        'secondary-container': '#04b71a',
        'on-secondary': '#003a03',
        
        tertiary: '#cdcd00',
        'tertiary-container': '#b1b100',
        
        error: '#ffb4ab',
        'error-container': '#93000a',
        
        'on-surface': '#e1e2e9',
        'on-surface-variant': '#c4c6d0',
        outline: '#8e9199',
        'outline-variant': '#44474e',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '40px',
        xl: '64px',
        'container-padding': '24px',
        gutter: '16px',
      },
      borderRadius: {
        DEFAULT: '16px',
        lg: '32px',
        xl: '48px',
        full: '9999px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          'from': { opacity: '0.05' },
          'to': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        twinkle: 'twinkle 2s alternate infinite',
        bounce: 'bounce 2s infinite'
      }
    }
  }
}
