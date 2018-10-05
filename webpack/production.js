// main modules
const path = require('path');
const BabelPresetMinify = require('babel-preset-minify');
const merge = require('webpack-merge');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');

// main config
module.exports = merge(require('./common'), {
  entry: {
    'bundle': './src/index.js',
    'bundle.min': './src/index.js'
  },
  plugins: [
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: false,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    })
  ]
});
