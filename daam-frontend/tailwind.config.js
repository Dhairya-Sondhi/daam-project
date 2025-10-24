/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Minimal global animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        // Login specific animations - slide and glow
        "login-slide-up": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(20px) scale(0.98)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)" 
          }
        },
        "login-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" 
          }
        },
        // Signup specific animations - bounce and pulse
        "signup-bounce": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(-10px) scale(0.95)" 
          },
          "60%": { 
            transform: "translateY(5px) scale(1.02)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0) scale(1)" 
          }
        },
        "signup-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)" 
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.7)" 
          }
        }
      },
      animation: {
        // Global
        "fade-in": "fade-in 0.3s ease-out",
        // Login specific
        "login-slide": "login-slide-up 0.5s ease-out",
        "login-glow": "login-glow 2s ease-in-out infinite",
        // Signup specific  
        "signup-bounce": "signup-bounce 0.6s ease-out",
        "signup-pulse": "signup-pulse 2.5s ease-in-out infinite",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
