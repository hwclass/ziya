const path = require('path');

module.exports = {
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development',
  input: path.resolve(__dirname, '../client'),
  output: path.resolve(__dirname, '../build'),
};
