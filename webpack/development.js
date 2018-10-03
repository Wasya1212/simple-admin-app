// main modules
const path = require('path');
const Webpack = require('webpack');
const BabelPresetMinify = require('babel-preset-minify');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fsdir = require('./common');

console.log(fsdir().plugins);

// main config
module.exports = dirname => ({
  entry: {
    'bundle': './src/index.js'
  },
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es2017', 'es2015', 'stage-3'],
            plugins: ['transform-runtime']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(dirname, 'src/index.html')
    }),
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: true,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    }),
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(dirname, './dist/'),
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
