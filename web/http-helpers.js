var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// var url = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, callback);
};

exports.sendResponse = function(res, statusCode, data) {
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
      action(req, res);
    } else {
      exports.sendRespone(res, 405, 'Method not allowed');
    }
  }
};