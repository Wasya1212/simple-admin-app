// additional constants
const MODE = process.env.NODE_ENV || 'development';

// main config
module.exports = () => {
  switch (MODE) {
    case 'development':
      return require('./webpack/development')(__dirname);
      break;
    case 'production':
      return require('./webpack/production')(__dirname);
      break;
    default:
      return require('./webpack/development')(__dirname);
  }
}
