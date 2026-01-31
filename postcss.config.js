/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Uses browserslist from .browserslistrc or package.json
  },
};

module.exports = config;
