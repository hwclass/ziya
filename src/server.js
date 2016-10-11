#!/usr/bin/env node
var express = require('express'),
	app = express(),
	fs = require('fs'),
	cors = require('cors'),
	path = require('path');

var corsOptions = {
	origin: 'http://localhost:5000',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};

fs.readdir('./', function(err, items) {
	for (var idx=0; idx<items.length; idx++) {
	    files.push({name: items[idx]});
	}
});

let files = [];

app.all('*', function(req, res,next) {
  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
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

app.get('/content/:fileName', function (req, res, next) {
	console.dir(req.params.fileName);
	var filePath = path.join(__dirname, req.params.fileName);
	var stat = fs.statSync(filePath);
	res.writeHead(200, {
	  "Content-Type": "application/octet-stream",
	  "Content-Disposition" : "attachment; filename=" + req.params.fileName});
	fs.createReadStream(filePath).pipe(res);
})

app.listen(5000, function() {
  console.log('Listening on port 5000...')
})