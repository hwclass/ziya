const webpack = require('webpack');
const merge = require('lodash.merge');

const config = require('./');
const baseConfig = require('./webpack.base');

module.exports = merge({}, baseConfig, {
  devtool: 'eval',

  entry: {
    main: [
      'webpack-hot-middleware/client?reload=true',
      'react-hot-loader/patch',
      'babel-polyfill',
      'whatwg-fetch',
      './src/index.js',
    ],
  },

  output: merge(baseConfig.output, {
    filename: 'scripts/[name].js',
    publicPath: '/',
  }),

  module: {
    loaders: baseConfig.module.loaders.concat([
      {
        test: /\.css/,
        loaders: [
          'style',
          'css-loader?sourceMap',
          'postcss',
        ],
      },
    ]),
  },

  plugins: baseConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]),
});
