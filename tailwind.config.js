export default {
  content: ['./assets/**/*.html', './assets/views/**/*.html'],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          '0 0px 20px rgba(255,255, 255, 0.35)',
          '0 0px 65px rgba(255, 255,255, 0.2)',
        ],
      },
    },
  },
  plugins: [],
};
