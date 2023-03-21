const colors = require('tailwindcss/colors')

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

function getSemanticColors(color) {
  return {
    light: color[100],
    DEFAULT: color[500],
    dark: color[600]
  }
}

function generateSemanticColors() {
  const semanticColors = {}
  for (const color in colors) {
    if (typeof colors[color] !== "string") {
      semanticColors[color] = getSemanticColors(colors[color])
    }
  }
  return semanticColors
}

module.exports = {
  mode: 'jit',
  content: ['./**/*.ts', './**/*.tsx'],
  safelist: [
    {
      pattern: /grid-cols-.+/,
    },
    {
      pattern: /col-span-.+/,
    },
    {
      pattern: /text-.+/,
    },
    {
      pattern: /bg-.+/,
    },    
    {
      pattern: /animate-.+/,
    },
    {
      pattern: /react-select.*/,
    },
    {
      pattern: /react-datepicker.*/,
    },
    {
      pattern: /swiper.*/,
    },
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',      
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          light: 'var(--color-accent-light)',
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
        },
        info: getSemanticColors(colors.blue),
        success: getSemanticColors(colors.green),
        warning: getSemanticColors(colors.yellow),
        danger: getSemanticColors(colors.red),
        ...generateSemanticColors(),
      },
      maxWidth: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
      },
      minWidth: {
        'none': 'none',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      height: {
        18: '4.5rem',
        22: '5.5rem',
      },
      minHeight: {
        'none': 'none',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        24: '6rem',
        28: '7rem',
        '4xs': '8rem',
        '3xs': '12rem',
        '2xs': '16rem',
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'min': 'min-content',
      },
      borderRadius: {
        inherit: 'inherit'
      },
      keyframes: {
        emerge: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fade: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        emergeUp: {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideInBottom: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        slideOutBottom: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        slideOutLeft: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        slideOutRight: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        scaleUp: {
          from: {  opacity: 0, transform: "scale(0.6)" },
          to: {  opacity: 1, transform: "scale(1)" },
        },
        scaleDown: {
          from: { opacity: 1,  ransform: "scale(1)" },
          to: {  opacity: 0, transform: "scale(0.6)" },
        },
        scaleInLeft: {
          from: { opacity: 0, transform: "scaleX(0)", transformOrigin: "center left" },
          to: { opacity: 1, transform: "scaleX(1)", transformOrigin: "center left" },
        },
        scaleOutLeft: {
          from: { opacity: 1, transform: "scaleX(1)", transformOrigin: "center left" },
          to: { opacity: 0, transform: "scaleX(0)", transformOrigin: "center left" },
        },
        scaleInRight: {
          from: { opacity: 0, transform: "scaleX(0)", transformOrigin: "center right" },
          to: { opacity: 1, transform: "scaleX(1)", transformOrigin: "center right" },
        },
        scaleOutRight: {
          from: { opacity: 1, transform: "scaleX(1)", transformOrigin: "center right" },
          to: { opacity: 0, transform: "scaleX(0)", transformOrigin: "center right" },
        },
      },
      zIndex: {
        100: "100",
        200: "200",
        300: "300",
        400: "400",
        500: "500",
      },
      animation: {
        emerge: "emerge 0.1s ease-in",
        fade: "fade .1s ease-out forwards",
        "emerge-up": "emergeUp .1s ease-in",
        "slide-in-bottom": "slideInBottom .1s ease-in",
        "slide-out-bottom": "slideOutBottom .1s ease-out forwards",
        "scale-up": "scaleUp .1s ease-in",
        "scale-down": "scaleDown .1s ease-out forwards",
        "slide-in-left": "slideInLeft .1s ease-in",
        "slide-out-left": "slideOutLeft .1s ease-out forwards",
        "slide-in-right": "slideInRight .1s ease-in",
        "slide-out-right": "slideOutRight .1s ease-out forwards",
        "scale-in-left": "scaleInLeft .1s ease-in",
        "scale-out-left": "scaleOutLeft .1s ease-out forwards",
        "scale-in-right": "scaleInRight .1s ease-in",
        "scale-out-right": "scaleOutRight .1s ease-out forwards",
      },
    },
  },
}
