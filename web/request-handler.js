var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(err, data) {
    if (err) {
      helpers.sendResponse(res, 404, 'File not found');
    } else {
      helpers.sendResponse(res, 200, data);
    }
  });
};
