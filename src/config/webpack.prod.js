const webpack = require('webpack');
const merge = require('lodash.merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const baseConfig = require('./webpack.base');

const extractCSS = new ExtractTextPlugin('styles/[name].[hash].css', { allChunks: true });

module.exports = merge({}, baseConfig, {
  debug: false,
  devtool: false,

  entry: {
    main: [
      './client/index.jsx',
    ],
    vendor: [
      'babel-polyfill',
      'whatwg-fetch',
      'react',
      'react-dom',
    ],
  },

  module: {
    loaders: baseConfig.module.loaders.concat([
      {
        test: /\.css/,
        loader: extractCSS.extract(
          'style',
          'css-loader?!postcss'
        ),
      },
    ]),
  },

  plugins: baseConfig.plugins.concat([
    extractCSS,

    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      minimize: true,
      comments: false,
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'scripts/[name].[hash].js',
      minChunks: Infinity,
    }),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),

    new ProgressBarPlugin(),
  ]),
});
