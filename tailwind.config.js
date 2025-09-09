/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator|theme)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary|secondary|accent)/,
    },
    {
      pattern:
        /(bg|border|text)-(surface|content|border|interactive|feedback|feedbackSurface)-(primary|secondary|tertiary|elevated|inverse|default|subtle|strong|focus|disabled|error|success|warning|info)/,
    },
    {
      pattern:
        /(bg|border|text)-(modern)-(primary|secondary|accent|bg-primary|bg-secondary|bg-tertiary|text-primary|text-secondary|text-tertiary|text-inverse|border-light|border-medium|border-strong|status-success|status-warning|status-error|status-info|surface-success|surface-warning|surface-error|surface-info)/,
    },
    {
      pattern:
        /(bg|border|text)-(vibrant|ocean|peach|forest|sunset|lavender|midnight|coral|sage)-(pink|pink-light|blue|blue-brutal|blue-light|blue-medium|blue-dark|yellow|navy|navy-light|teal|cyan|cyan-light|ice-blue|light-cyan|sky|sky-light|sky-tint|deep|deep-light|light-blue|emerald|rose|rose-light|rose-dark|rose-darker|rose-darkest|fuzz|orange|orange-dark|orange-darker|orange-darkest|brown|brown-light|brown-medium|peach-tint|peach-light|green|green-light|green-dark|green-darker|green-darkest|green-tint|green-light-bg|sage|sage-light|sage-dark|sage-tint|sage-medium|purple|purple-light|purple-dark|purple-darker|purple-darkest|purple-tint|purple-light-bg|purple-medium|indigo|slate|slate-light|slate-lighter|slate-lightest|coral-tint|coral-light|pink|lime|lime-light|lime-dark|lime-darker|lime-darkest|red)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          0: 'rgb(var(--color-primary-0)/<alpha-value>)',
          50: 'rgb(var(--color-primary-50)/<alpha-value>)',
          100: 'rgb(var(--color-primary-100)/<alpha-value>)',
          200: 'rgb(var(--color-primary-200)/<alpha-value>)',
          300: 'rgb(var(--color-primary-300)/<alpha-value>)',
          400: 'rgb(var(--color-primary-400)/<alpha-value>)',
          500: 'rgb(var(--color-primary-500)/<alpha-value>)',
          600: 'rgb(var(--color-primary-600)/<alpha-value>)',
          700: 'rgb(var(--color-primary-700)/<alpha-value>)',
          800: 'rgb(var(--color-primary-800)/<alpha-value>)',
          900: 'rgb(var(--color-primary-900)/<alpha-value>)',
          950: 'rgb(var(--color-primary-950)/<alpha-value>)',
        },
        secondary: {
          0: 'rgb(var(--color-secondary-0)/<alpha-value>)',
          50: 'rgb(var(--color-secondary-50)/<alpha-value>)',
          100: 'rgb(var(--color-secondary-100)/<alpha-value>)',
          200: 'rgb(var(--color-secondary-200)/<alpha-value>)',
          300: 'rgb(var(--color-secondary-300)/<alpha-value>)',
          400: 'rgb(var(--color-secondary-400)/<alpha-value>)',
          500: 'rgb(var(--color-secondary-500)/<alpha-value>)',
          600: 'rgb(var(--color-secondary-600)/<alpha-value>)',
          700: 'rgb(var(--color-secondary-700)/<alpha-value>)',
          800: 'rgb(var(--color-secondary-800)/<alpha-value>)',
          900: 'rgb(var(--color-secondary-900)/<alpha-value>)',
          950: 'rgb(var(--color-secondary-950)/<alpha-value>)',
        },
        tertiary: {
          50: 'rgb(var(--color-tertiary-50)/<alpha-value>)',
          100: 'rgb(var(--color-tertiary-100)/<alpha-value>)',
          200: 'rgb(var(--color-tertiary-200)/<alpha-value>)',
          300: 'rgb(var(--color-tertiary-300)/<alpha-value>)',
          400: 'rgb(var(--color-tertiary-400)/<alpha-value>)',
          500: 'rgb(var(--color-tertiary-500)/<alpha-value>)',
          600: 'rgb(var(--color-tertiary-600)/<alpha-value>)',
          700: 'rgb(var(--color-tertiary-700)/<alpha-value>)',
          800: 'rgb(var(--color-tertiary-800)/<alpha-value>)',
          900: 'rgb(var(--color-tertiary-900)/<alpha-value>)',
          950: 'rgb(var(--color-tertiary-950)/<alpha-value>)',
        },
        error: {
          0: 'rgb(var(--color-error-0)/<alpha-value>)',
          50: 'rgb(var(--color-error-50)/<alpha-value>)',
          100: 'rgb(var(--color-error-100)/<alpha-value>)',
          200: 'rgb(var(--color-error-200)/<alpha-value>)',
          300: 'rgb(var(--color-error-300)/<alpha-value>)',
          400: 'rgb(var(--color-error-400)/<alpha-value>)',
          500: 'rgb(var(--color-error-500)/<alpha-value>)',
          600: 'rgb(var(--color-error-600)/<alpha-value>)',
          700: 'rgb(var(--color-error-700)/<alpha-value>)',
          800: 'rgb(var(--color-error-800)/<alpha-value>)',
          900: 'rgb(var(--color-error-900)/<alpha-value>)',
          950: 'rgb(var(--color-error-950)/<alpha-value>)',
        },
        success: {
          0: 'rgb(var(--color-success-0)/<alpha-value>)',
          50: 'rgb(var(--color-success-50)/<alpha-value>)',
          100: 'rgb(var(--color-success-100)/<alpha-value>)',
          200: 'rgb(var(--color-success-200)/<alpha-value>)',
          300: 'rgb(var(--color-success-300)/<alpha-value>)',
          400: 'rgb(var(--color-success-400)/<alpha-value>)',
          500: 'rgb(var(--color-success-500)/<alpha-value>)',
          600: 'rgb(var(--color-success-600)/<alpha-value>)',
          700: 'rgb(var(--color-success-700)/<alpha-value>)',
          800: 'rgb(var(--color-success-800)/<alpha-value>)',
          900: 'rgb(var(--color-success-900)/<alpha-value>)',
          950: 'rgb(var(--color-success-950)/<alpha-value>)',
        },
        warning: {
          0: 'rgb(var(--color-warning-0)/<alpha-value>)',
          50: 'rgb(var(--color-warning-50)/<alpha-value>)',
          100: 'rgb(var(--color-warning-100)/<alpha-value>)',
          200: 'rgb(var(--color-warning-200)/<alpha-value>)',
          300: 'rgb(var(--color-warning-300)/<alpha-value>)',
          400: 'rgb(var(--color-warning-400)/<alpha-value>)',
          500: 'rgb(var(--color-warning-500)/<alpha-value>)',
          600: 'rgb(var(--color-warning-600)/<alpha-value>)',
          700: 'rgb(var(--color-warning-700)/<alpha-value>)',
          800: 'rgb(var(--color-warning-800)/<alpha-value>)',
          900: 'rgb(var(--color-warning-900)/<alpha-value>)',
          950: 'rgb(var(--color-warning-950)/<alpha-value>)',
        },
        info: {
          0: 'rgb(var(--color-info-0)/<alpha-value>)',
          50: 'rgb(var(--color-info-50)/<alpha-value>)',
          100: 'rgb(var(--color-info-100)/<alpha-value>)',
          200: 'rgb(var(--color-info-200)/<alpha-value>)',
          300: 'rgb(var(--color-info-300)/<alpha-value>)',
          400: 'rgb(var(--color-info-400)/<alpha-value>)',
          500: 'rgb(var(--color-info-500)/<alpha-value>)',
          600: 'rgb(var(--color-info-600)/<alpha-value>)',
          700: 'rgb(var(--color-info-700)/<alpha-value>)',
          800: 'rgb(var(--color-info-800)/<alpha-value>)',
          900: 'rgb(var(--color-info-900)/<alpha-value>)',
          950: 'rgb(var(--color-info-950)/<alpha-value>)',
        },
        typography: {
          0: 'rgb(var(--color-typography-0)/<alpha-value>)',
          50: 'rgb(var(--color-typography-50)/<alpha-value>)',
          100: 'rgb(var(--color-typography-100)/<alpha-value>)',
          200: 'rgb(var(--color-typography-200)/<alpha-value>)',
          300: 'rgb(var(--color-typography-300)/<alpha-value>)',
          400: 'rgb(var(--color-typography-400)/<alpha-value>)',
          500: 'rgb(var(--color-typography-500)/<alpha-value>)',
          600: 'rgb(var(--color-typography-600)/<alpha-value>)',
          700: 'rgb(var(--color-typography-700)/<alpha-value>)',
          800: 'rgb(var(--color-typography-800)/<alpha-value>)',
          900: 'rgb(var(--color-typography-900)/<alpha-value>)',
          950: 'rgb(var(--color-typography-950)/<alpha-value>)',
          white: '#FFFFFF',
          gray: '#D4D4D4',
          black: '#181718',
        },
        outline: {
          0: 'rgb(var(--color-outline-0)/<alpha-value>)',
          50: 'rgb(var(--color-outline-50)/<alpha-value>)',
          100: 'rgb(var(--color-outline-100)/<alpha-value>)',
          200: 'rgb(var(--color-outline-200)/<alpha-value>)',
          300: 'rgb(var(--color-outline-300)/<alpha-value>)',
          400: 'rgb(var(--color-outline-400)/<alpha-value>)',
          500: 'rgb(var(--color-outline-500)/<alpha-value>)',
          600: 'rgb(var(--color-outline-600)/<alpha-value>)',
          700: 'rgb(var(--color-outline-700)/<alpha-value>)',
          800: 'rgb(var(--color-outline-800)/<alpha-value>)',
          900: 'rgb(var(--color-outline-900)/<alpha-value>)',
          950: 'rgb(var(--color-outline-950)/<alpha-value>)',
        },
        background: {
          0: 'rgb(var(--color-background-0)/<alpha-value>)',
          50: 'rgb(var(--color-background-50)/<alpha-value>)',
          100: 'rgb(var(--color-background-100)/<alpha-value>)',
          200: 'rgb(var(--color-background-200)/<alpha-value>)',
          300: 'rgb(var(--color-background-300)/<alpha-value>)',
          400: 'rgb(var(--color-background-400)/<alpha-value>)',
          500: 'rgb(var(--color-background-500)/<alpha-value>)',
          600: 'rgb(var(--color-background-600)/<alpha-value>)',
          700: 'rgb(var(--color-background-700)/<alpha-value>)',
          800: 'rgb(var(--color-background-800)/<alpha-value>)',
          900: 'rgb(var(--color-background-900)/<alpha-value>)',
          950: 'rgb(var(--color-background-950)/<alpha-value>)',
          error: 'rgb(var(--color-background-error)/<alpha-value>)',
          warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
          muted: 'rgb(var(--color-background-muted)/<alpha-value>)',
          success: 'rgb(var(--color-background-success)/<alpha-value>)',
          info: 'rgb(var(--color-background-info)/<alpha-value>)',
          light: '#FBFBFB',
          dark: '#181719',
        },
        indicator: {
          primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
          info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
          error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
        },
        theme: {
          primary: 'rgb(var(--color-theme-primary)/<alpha-value>)',
          secondary: 'rgb(var(--color-theme-secondary)/<alpha-value>)',
          accent: 'rgb(var(--color-theme-accent)/<alpha-value>)',
        },
        
        // Semantic color tokens
        surface: {
          primary: 'rgb(var(--color-background-0)/<alpha-value>)',
          secondary: 'rgb(var(--color-background-50)/<alpha-value>)',
          tertiary: 'rgb(var(--color-background-100)/<alpha-value>)',
          elevated: 'rgb(var(--color-background-0)/<alpha-value>)',
          inverse: 'rgb(var(--color-background-900)/<alpha-value>)',
        },
        
        content: {
          primary: 'rgb(var(--color-typography-900)/<alpha-value>)',
          secondary: 'rgb(var(--color-typography-600)/<alpha-value>)',
          tertiary: 'rgb(var(--color-typography-400)/<alpha-value>)',
          disabled: 'rgb(var(--color-typography-300)/<alpha-value>)',
          inverse: 'rgb(var(--color-typography-0)/<alpha-value>)',
        },
        
        border: {
          default: 'rgb(var(--color-outline-200)/<alpha-value>)',
          subtle: 'rgb(var(--color-outline-100)/<alpha-value>)',
          strong: 'rgb(var(--color-outline-400)/<alpha-value>)',
          focus: 'rgb(var(--color-primary-500)/<alpha-value>)',
        },
        
        interactive: {
          primary: 'rgb(var(--color-primary-600)/<alpha-value>)',
          secondary: 'rgb(var(--color-secondary-600)/<alpha-value>)',
          tertiary: 'rgb(var(--color-tertiary-600)/<alpha-value>)',
          disabled: 'rgb(var(--color-secondary-200)/<alpha-value>)',
        },
        
        feedback: {
          error: 'rgb(var(--color-error-600)/<alpha-value>)',
          success: 'rgb(var(--color-success-600)/<alpha-value>)',
          warning: 'rgb(var(--color-warning-600)/<alpha-value>)',
          info: 'rgb(var(--color-info-600)/<alpha-value>)',
        },
        
        feedbackSurface: {
          error: 'rgb(var(--color-background-error)/<alpha-value>)',
          success: 'rgb(var(--color-background-success)/<alpha-value>)',
          warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
          info: 'rgb(var(--color-background-info)/<alpha-value>)',
        },

        // Modern theme-specific colors (dynamic based on selected theme)
        modern: {
          primary: 'rgb(var(--modern-primary)/<alpha-value>)',
          secondary: 'rgb(var(--modern-secondary)/<alpha-value>)',
          accent: 'rgb(var(--modern-accent)/<alpha-value>)',
          'bg-primary': 'rgb(var(--modern-bg-primary)/<alpha-value>)',
          'bg-secondary': 'rgb(var(--modern-bg-secondary)/<alpha-value>)',
          'bg-tertiary': 'rgb(var(--modern-bg-tertiary)/<alpha-value>)',
          'text-primary': 'rgb(var(--modern-text-primary)/<alpha-value>)',
          'text-secondary': 'rgb(var(--modern-text-secondary)/<alpha-value>)',
          'text-tertiary': 'rgb(var(--modern-text-tertiary)/<alpha-value>)',
          'text-inverse': 'rgb(var(--modern-text-inverse)/<alpha-value>)',
          'border-light': 'rgb(var(--modern-border-light)/<alpha-value>)',
          'border-medium': 'rgb(var(--modern-border-medium)/<alpha-value>)',
          'border-strong': 'rgb(var(--modern-border-strong)/<alpha-value>)',
          'status-success': 'rgb(var(--modern-status-success)/<alpha-value>)',
          'status-warning': 'rgb(var(--modern-status-warning)/<alpha-value>)',
          'status-error': 'rgb(var(--modern-status-error)/<alpha-value>)',
          'status-info': 'rgb(var(--modern-status-info)/<alpha-value>)',
          'surface-success': 'rgb(var(--modern-surface-success)/<alpha-value>)',
          'surface-warning': 'rgb(var(--modern-surface-warning)/<alpha-value>)',
          'surface-error': 'rgb(var(--modern-surface-error)/<alpha-value>)',
          'surface-info': 'rgb(var(--modern-surface-info)/<alpha-value>)',
        },

        // Vibrant theme colors (Electric and energetic)
        vibrant: {
          pink: '#ff1d58',      // Yass Queen
          'pink-light': '#f75990', // Sister sister
          blue: '#00ddff',      // Electric blue
          'blue-brutal': '#0049b7', // Brutal blue
          yellow: '#fff685',    // Crown yellow
          navy: '#0a0e27',      // Deep navy
          'navy-light': '#1a1f3a', // Lighter navy
          teal: '#00c896',      // Vibrant teal
          cyan: '#00bcd4',      // Cyan
          'ice-blue': '#f0fdff', // Ice cold blue tint
          'light-cyan': '#e0f7fa', // Light cyan
        },

        // Ocean theme colors (Calming blues and sea greens)
        ocean: {
          cyan: '#06b6d4',      // Cyan 500
          'cyan-light': '#22d3ee', // Cyan 400
          sky: '#0ea5e9',       // Sky blue
          'sky-light': '#38bdf8', // Sky blue 400
          deep: '#0c4a6e',      // Deep ocean
          'deep-light': '#164e63', // Ocean blue 800
          'sky-tint': '#f0f9ff', // Sky blue tint
          'light-blue': '#e0f2fe', // Light blue
          emerald: '#059669',   // Emerald 600
          rose: '#f43f5e',      // Rose 500
        },

        // Peach theme colors (2024 Pantone Color of the Year)
        peach: {
          fuzz: '#ffb4a2',      // Peach Fuzz (Pantone 2024)
          orange: '#fb923c',    // Orange 400
          'orange-dark': '#f97316', // Orange 500
          brown: '#431407',     // Dark brown
          'brown-light': '#7c2d12', // Brown 800
          'brown-medium': '#9a3412', // Brown 700
          'peach-tint': '#fef7f0', // Peach tint
          'peach-light': '#fed7aa', // Light peach
        },

        // Forest theme colors (Natural greens and earth tones)
        forest: {
          green: '#16a34a',     // Green 600
          'green-light': '#22c55e', // Green 500
          'green-dark': '#15803d', // Green 700
          'green-darker': '#166534', // Green 800
          'green-darkest': '#14532d', // Green 900
          'green-tint': '#f0fdf4', // Green 50
          'green-light-bg': '#dcfce7', // Green 100
          sage: '#84cc16',      // Lime 500
          'sage-light': '#a3e635', // Lime 400
          'sage-dark': '#65a30d', // Lime 600
        },

        // Sunset theme colors (Warm oranges and reds)
        sunset: {
          orange: '#f97316',    // Orange 500
          'orange-dark': '#ea580c', // Orange 600
          'orange-darker': '#c2410c', // Orange 700
          'orange-darkest': '#9a3412', // Orange 800
          red: '#dc2626',       // Red 600
          brown: '#7c2d12',     // Orange 900
          'orange-tint': '#fff7ed', // Orange 50
          'orange-light': '#fed7aa', // Orange 200
        },

        // Lavender theme colors (Soft purples and dreamy colors)
        lavender: {
          purple: '#8b5cf6',    // Violet 500
          'purple-light': '#a855f7', // Violet 500
          'purple-dark': '#7c3aed', // Violet 600
          'purple-darker': '#6b21a8', // Violet 800
          'purple-darkest': '#581c87', // Violet 900
          indigo: '#6366f1',    // Indigo 500
          'purple-tint': '#faf5ff', // Violet 50
          'purple-light-bg': '#e9d5ff', // Violet 200
          'purple-medium': '#c4b5fd', // Violet 300
        },

        // Midnight theme colors (Deep blues and sophisticated darks)
        midnight: {
          blue: '#1e40af',      // Blue 800
          'blue-light': '#3b82f6', // Blue 500
          'blue-medium': '#2563eb', // Blue 600
          'blue-dark': '#1d4ed8', // Blue 700
          slate: '#1e293b',     // Slate 800
          'slate-light': '#334155', // Slate 700
          'slate-lighter': '#475569', // Slate 600
          'slate-lightest': '#64748b', // Slate 500
        },

        // Coral theme colors (Warm coral and pink tones)
        coral: {
          rose: '#f43f5e',      // Rose 500
          'rose-light': '#fb7185', // Rose 400
          'rose-dark': '#e11d48', // Rose 600
          'rose-darker': '#be185d', // Pink 700
          'rose-darkest': '#881337', // Rose 900
          pink: '#f9a8d4',      // Pink 300
          'coral-tint': '#fdf2f8', // Pink 50
          'coral-light': '#fce7f3', // Pink 100
        },

        // Sage theme colors (Muted greens and earth tones)
        sage: {
          lime: '#84cc16',      // Lime 500
          'lime-light': '#a3e635', // Lime 400
          'lime-dark': '#65a30d', // Lime 600
          'lime-darker': '#4d7c0f', // Lime 700
          'lime-darkest': '#365314', // Lime 900
          'sage-tint': '#f7fee7', // Lime 50
          'sage-light': '#ecfccb', // Lime 100
          'sage-medium': '#d9f99d', // Lime 200
        },
      },
      fontFamily: {
        heading: undefined,
        body: undefined,
        mono: undefined,
        jakarta: ['var(--font-plus-jakarta-sans)'],
        roboto: ['var(--font-roboto)'],
        code: ['var(--font-source-code-pro)'],
        inter: ['var(--font-inter)'],
        'space-mono': ['var(--font-space-mono)'],
      },
      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
