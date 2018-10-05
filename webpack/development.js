// main modules
const path = require('path');
const Webpack = require('webpack');
const BabelPresetMinify = require('babel-preset-minify');
const merge = require('webpack-merge');
const fs = require('fs');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// find all files in directory
function findFiles(dir, regExp) {
  let files = fs.readdirSync(dir);

  return files.filter(file => regExp.test(file));
}

let HTMLFiles = findFiles(path.resolve(__dirname, '../examples/html'), /\.html$/);
let HTMLPlugins = HTMLFiles.map(file => new HtmlWebpackPlugin({
  inject: false,
  template: path.resolve(__dirname, `../examples/html/${file}`),
  filename: file
}));

// main config
module.exports = merge(require('./common'), {
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, '../examples/html/index.html')
    }),
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: true,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    }),
    new Webpack.HotModuleReplacementPlugin()
  ].concat(HTMLPlugins),
  devServer: {
    contentBase: [
      path.join(__dirname, '../dist'),
      path.join(__dirname, '../examples/html'),
      path.join(__dirname, '../examples/js'),
      path.join(__dirname, '../examples/css')
    ],
    compress: false,
    port: 3000,
    index: 'index.html',
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    inline: true
  }
});
