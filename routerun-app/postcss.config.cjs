module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    {
      postcssPlugin: 'postcss-replace-webkit-text-size-adjust',
      Once(root) {
        root.walkDecls('-webkit-text-size-adjust', decl => {
          decl.remove();
        });
      }
    }
  ]
};

module.exports.postcss = true;
