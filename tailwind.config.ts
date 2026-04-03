import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── 브랜드 컬러 (HTML 시안 CSS 변수 → Tailwind) ──────────
      colors: {
        red: {
          DEFAULT: '#e60023',
          dark:    '#b5001b',
          '50':    'rgba(230,0,35,0.05)',
          '100':   'rgba(230,0,35,0.10)',
          '200':   'rgba(230,0,35,0.18)',
          '300':   'rgba(230,0,35,0.28)',
        },
        bg:       '#0f1012',
        surface:  '#1a1b1e',
        surface2: '#222428',
        ink:      '#e8eaed',
        muted:    '#8a9099',
        line:     '#2a2d32',
        line2:    '#383c42',
      },

      // ── 폰트 ──────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'Pretendard Variable', 'Pretendard',
          '-apple-system', 'BlinkMacSystemFont',
          'Malgun Gothic', 'sans-serif',
        ],
      },

      // ── 사이즈 ────────────────────────────────────────────────
      maxWidth: {
        site: '1360px',
      },
      height: {
        header: '76px',
      },

      // ── 그림자 ────────────────────────────────────────────────
      boxShadow: {
        card:  '0 14px 34px rgba(17,17,17,0.08)',
        red:   '0 12px 24px rgba(230,0,35,0.18)',
        mega:  '0 22px 50px rgba(17,17,17,0.13)',
      },

      // ── 애니메이션 ────────────────────────────────────────────
      keyframes: {
        heroZoom: {
          '0%':   { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.0)' },
        },
        sweep: {
          '0%':   { left: '-46%' },
          '100%': { left: '110%' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        heroZoom: 'heroZoom 12s ease-in-out infinite alternate',
        sweep:    'sweep 4.8s ease-in-out infinite',
        fadeUp:   'fadeUp 0.5s ease forwards',
        fadeIn:   'fadeIn 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
