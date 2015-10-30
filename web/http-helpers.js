var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, contentType) {
  contentType = contentType || "text/html";
  fs.readFile(asset, function(err, data) {
    if (err) {
      exports.sendResponse(res, 404, 'File not found', contentType);
    } else {
      exports.sendResponse(res, 200, data, contentType);
    }
  });
};

exports.sendResponse = function(res, statusCode, data, contentType) {
  contentType = contentType || "text/html";
  headers['Content-Type'] = contentType;
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.receiveData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    callback(data);
  });
};

exports.makeActionHandler = function(actionMap) {
  return function(req, res) {
    var action = actionMap[req.method];
    if (action) {
      console.log('Receiveing a ' + req.method + ' call on url: ' + req.url);
      action(req, res);
    } else {
      exports.sendRespone(res, 405, 'Method not allowed');
    }
  }
};