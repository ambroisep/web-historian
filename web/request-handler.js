var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var callback = function(err, data) {
    if (err) {
      helpers.sendResponse(res, 404, 'File not found');
    } else {
      helpers.sendResponse(res, 200, data);
    }
  };

  var webSiteName = path.basename(req.url);
  if(!webSiteName) {
    helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', callback); 
  } else if (archive.isUrlArchived(webSiteName)) {
    helpers.serveAssets(res, archive.paths.archivedSites + '/' + webSiteName, callback);
  }
};
