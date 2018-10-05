// additional constants
const MODE = process.env.NODE_ENV || 'development';

// main config
module.exports = () => {
  switch (MODE) {
    case 'development':
      return require('./webpack/development');
      break;
    case 'production':
      return require('./webpack/production');
      break;
    default:
      return require('./webpack/development');
  }
}
