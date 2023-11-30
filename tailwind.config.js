/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mainRegular: ["Inter-Regular", "sans-serif"],
        mainMedium: ["Inter-Medium", "sans-serif"],
        mainSemibold: ["Inter-SemiBold", "sans-serif"],
      },
      colors: {
        gray: {
          100: "#DADADA",
          200: "#ECECEC",
          300: "#F2F2F2",
          600: "#E7E7E7",
        },
        "white-80": "rgba(255, 255, 255, 0.80)",
        surfacePrimary: "#FFFFFF",
        textPrimary: "#111111",
        textSecondary: "#888888",
        primitives: {
          50: "#F6F6F6",
          100: "#E7E7E7",
        },
        blue: {
          300: "#5065E4",
          600: "#3E54DA",
          900: '#364DD8'
        },
        purple: {
          300: "#8247E5",
          600: "#7639DD",
          900: "#6C2CD6",
        },
        success: "#0DAB31",
        "success-16": "rgba(13, 171, 49, 0.16)",
        error: "#AB0D0D",
        "error-16": "rgba(171, 13, 13, 0.16)",
      },
      backgroundImage: {
        linearWhite: "linear-gradient(129deg, #FCFCFC 9.57%, #F9F9F9 89.79%)",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        xl: "20px",
        '2xl': "24px"
      },
    },
  },
  plugins: [],
};
