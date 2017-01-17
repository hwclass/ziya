#!/usr/bin/env node

const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path');

// Constants
const env = process.env.NODE_ENV;
const CONSTANTS = require('./constants');

// Helper Functions
const getDirectoryContents = require('./utils/getDirectoryContents');
const extractFileNameFromPath = require('./utils/extractFileNameFromPath');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: CONSTANTS.SERVER_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 * Reads content of a file
 */
app.get('/files/:path', function (req, res, next) {
  const filePath = path.join(req.params.path === 'root' ? process.cwd() : req.params.path);
  const fileName = extractFileNameFromPath(req.params.path);
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    fs.readdir(filePath, (err, items) => {
      const files = getDirectoryContents(filePath, items);
      res.status(200).send(files);
    });
  } else {
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition" : "attachment; filename=" + fileName
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

/**
 * Saves content of a file
 */
app.post('/files/:path', function (req, res, next) {
  const filePath = path.join(req.params.path);

  fs.writeFile(filePath, req.body.content, { encoding: 'utf8' }, function(err) {
    if (err) {
      return res.status(422).send(err);
    }
    res.status(200).send({ status: 'OK' });
  });
});

if (env === 'production') {
  // Set static file location
  app.use('/static', express.static(path.join(__dirname, CONSTANTS.STATIC_FILES_DIR)));

  // Serve built index.html with assets dependencies
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, CONSTANTS.VIEW_ENTRY_FILE));
  });
} else {
  // Add webpack dev-hot middlewares
  const webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware');
    webpackConfig = require('../config/webpack.dev.js');

  const compiler = webpack(webpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
    },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}

// Start server
app.listen(5000, function() {
  console.log('Listening on port 5000...');
});
