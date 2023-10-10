module.exports = {
    plugins: [
      require('postcss-preset-env')({
        // postcss-preset-env依赖了autoprefixer, 所以不需要单独安装
        autoprefixer: {
          // 或者在这里覆盖.browserslistrc
          // overrideBrowserslist: ['Chrome >= 52'],
        },
      })
    ]
  }
