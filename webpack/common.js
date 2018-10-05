// main modules
const path = require('path');

// main config
module.exports = {
  entry: {
    'bundle': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
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
  }
};
