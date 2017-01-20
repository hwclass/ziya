#!/usr/bin/env node
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Constants
const env = process.env.NODE_ENV;
const CONSTANTS = require('./constants');

// Helper Functions
const getDirectoryContents = require('./utils/getDirectoryContents');
const extractFileNameFromPath = require('./utils/extractFileNameFromPath');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Reads content of a file
 */
app.get('/files/:path', (req, res) => {
  const filePath = path.join(req.params.path === 'root' ? process.cwd() : req.params.path);
  const fileName = extractFileNameFromPath(req.params.path);
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    fs.readdir(filePath, { encoding: 'utf8' }, (err, items) => {
      const files = getDirectoryContents(filePath, items);
      res.status(200).send(files);
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream; charset=utf-8',
      'Content-Disposition': `attachment; filename=${fileName}`,
    });

    fs.createReadStream(filePath, 'utf8').pipe(res);
  }
});

/**
 * Saves content of a file
 */
app.post('/files/:path', (req, res) => {
  const filePath = path.join(req.params.path);

  fs.writeFile(filePath, req.body.content, { encoding: 'utf8' }, (err) => {
    if (err) {
      return res.status(422).send(err);
    }

    return res.status(200).send({ status: 'OK' });
  });
});

if (env === 'production') {
  // Set static file location
  app.use('/static', express.static(path.join(__dirname, CONSTANTS.STATIC_FILES_DIR)));

  // Serve built index.html with assets dependencies
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, CONSTANTS.VIEW_ENTRY_FILE));
  });
} else {
  // Add webpack dev-hot middlewares
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../config/webpack.dev.js');

  const compiler = webpack(webpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}

// Start server
app.listen(5000, () => {
  console.log('ziya is now working on port %s ...', process.env.PORT || 5000);
});
