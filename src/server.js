#!/usr/bin/env node

const express = require('express'),
  app = express(),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 * Returns contents of a read directory.
 * @param  {string} dirPath: path of parrent directory
 * @param  {array} items: contents of parrent directory, read by fs.readdir()
 * @return {array} [{ name, path, type}] of contents
 */
function getDirectoryContents(dirPath, items) {
  return items.map((item, index) => {
    const filePath = path.join(dirPath, item);
    const fileStat = fs.statSync(filePath);
    const fileType = (fileStat.isDirectory() && 'directory') || (fileStat.isFile() && 'file') || 'unknown';

    return {
      name: item,
      path: filePath,
      type: fileType,
    };
  });
}

app.all('*', function(req, res,next) {
  /**
   * Response settings
   * @type {Object}
   */
  const responseSettings = {
    "AccessControlAllowOrigin": req.headers.origin,
    "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/sse', function(req, res) {
  fs.readdir(process.cwd(), function(err, items) {
    const files = getDirectoryContents(__dirname, items);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write("data: " + JSON.stringify(files) + "\n\n");
    res.write('id: ' + Date.now() + '\n');
    res.end();
  });
});

app.get('/content/:itemName', function (req, res, next) {
  const filePath = path.join(__dirname, req.params.itemName);
  const fileStat = fs.statSync(filePath);

  if (fileStat.isDirectory()) {
    fs.readdir(filePath, (err, items) => {
      const files = getDirectoryContents(filePath, items);
      res.status(200).send(files);
    });
  } else {
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition" : "attachment; filename=" + req.paramsitemName
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

app.post('/content', function (req, res, next) {
  const filePath = path.join(__dirname, req.body.name);

  fs.writeFile(filePath, req.body.content, {encoding: 'utf8'}, function(err) {
    if(err) console.log(err);
    console.log("The file was saved: " + filePath);
  });

  res.json({
    status: 'OK',
    code: 200
  });
});

app.listen(5000, function() {
  console.log('Listening on port 5000...')
})