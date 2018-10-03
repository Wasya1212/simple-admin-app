// main modules
const path = require('path');
const Webpack = require('webpack');
const BabelPresetMinify = require('babel-preset-minify');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');

// main config
module.exports = dirname => ({
  entry: {
    'bundle': './src/index.js',
    'bundle.min': './src/index.js'
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
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: false,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    }),
    new Webpack.HotModuleReplacementPlugin()
  ]
});
