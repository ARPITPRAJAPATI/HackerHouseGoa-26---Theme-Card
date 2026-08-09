/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '18': '4.5rem',
        '76': '19rem',
      },
      colors: {
        goa: {
          dark: "#026834",
          card: "rgba(2, 60, 30, 0.85)",
          border: "rgba(254, 225, 1, 0.2)",
          teal: "#FEE101",
          cyan: "#FEE101",
          yellow: "#FEE101",
          green: "#026834",
          coral: "#FF007A",
          sunburst: "#FEE101",
          emerald: "#10B981",
          purple: "#8B5CF6"
        }
      },
      backgroundImage: {
        "goa-gradient": "linear-gradient(135deg, #FEE101 0%, #FFD166 50%, #FF9E00 100%)",
        "sunset-gradient": "linear-gradient(135deg, #FF007A 0%, #FEE101 100%)",
        "gold-gradient": "linear-gradient(135deg, #FEE101 0%, #FF9E00 100%)",
        "cyber-grid": "radial-gradient(circle at center, rgba(254,225,1,0.15) 0%, transparent 70%)"
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatUpNDown 3.5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(254, 225, 1, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(254, 225, 1, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatUpNDown: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-6deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-6deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
