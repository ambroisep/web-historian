var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var qs = require('querystring');
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
    helpers.receiveData(req, function(data) {
      var dataObj = qs.parse(data);
      archive.addUrlToList(dataObj['url'], function() {
        helpers.sendResponse(res, 302, 'Created');
      });
    })
  },

  'OPTIONS': function(req, res) {
    helpers.sendResponse(res, 200, null);
  }
};

exports.handleRequest = helpers.makeActionHandler(actions);