const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function findFiles(dir, regExp) {
  let files = [];

  return fs.readdir(dir, (err, readed_files) => {
    if (err) throw err;
    return readed_files.filter(file => regExp.test(file));
  });
}

module.exports = dirname => {
  let HTMLFiles = findFiles(path.resolve(__dirname, '../examples'), /\.m?js$/);

  console.log(HTMLFiles);

  return {
    plugins: HTMLFiles.map(file => new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(dirname, `src/${file}`)
    }))
  };
};
