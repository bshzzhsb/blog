const path = require('path');
const fs = require('fs');

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-url': {
      url: (asset) => {
        let { absolutePath } = asset;
        if (!/.ttf$/.test(absolutePath)) return;

        let basename = path.basename(absolutePath);
        let destPath = path.join(__dirname, 'public', 'fonts', basename);

        fs.copyFileSync(absolutePath, destPath);
        return '/' + path.join('fonts', basename);
      },
    },
  },
};
