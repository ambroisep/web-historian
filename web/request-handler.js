var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!


var actions = {
  'GET': function(req, res) {
    var callback = function(err, data) {
      if (err) {
        helpers.sendResponse(res, 404, 'File not found');
      } else {
        helpers.sendResponse(res, 200, data);
      }
    };

    var webSiteName = path.basename(req.url);
    var webSiteArchivePath = archive.paths.archivedSites + '/' + webSiteName;

    if(!webSiteName) {
      helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', callback); 
    } else if (archive.isUrlArchived(webSiteArchivePath)) {
      console.log('file exists');
      helpers.serveAssets(res, webSiteArchivePath, callback);
    } else {
      helpers.sendResponse(res, 404, 'File not found');
    }
  },

  'POST': function(req, res) {
    helpers.collectData(req, function(message) {
      message.objectId = ++objectIdCounter;
      messages.push(message);
      helpers.sendResponse(res, {objectId: message.objectId}, 201);
    });
  },
  'OPTIONS': function(req, res) {
    helpers.sendResponse(res, null);
  }
};

exports.handleRequest = helpers.makeActionHandler(actions);