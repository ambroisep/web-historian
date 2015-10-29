var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var qs = require('querystring');
// require more modules/folders here!


var actions = {
  'GET': function(req, res) {
    var webSiteName = path.basename(req.url);
    var webSiteArchivePath = archive.paths.archivedSites + '/' + webSiteName;

    if(!webSiteName) {
      helpers.serveAssets(res, archive.paths.siteAssets + '/index.html');
      archive.readListOfUrls(function(urlArray) {
        archive.downloadUrls(urlArray);
      });
    } else {
      archive.isUrlArchived(webSiteName, function(bool) {
        if (bool) {
          helpers.serveAssets(res, webSiteArchivePath);
        } else {
          helpers.sendResponse(res, 404, 'File not found');
        }
      });
    }
  },

  'POST': function(req, res) {
    helpers.receiveData(req, function(data) {
      var dataObj = qs.parse(data);
      archive.addUrlToList(dataObj['url'], function() {
        helpers.sendResponse(res, 302, 'Created');
      }, function() {
        helpers.sendResponse(res, 500, 'url not added to list');
      }, function() {
        helpers.serveAssets(res, archive.paths.siteAssets + '/loading.html')
      })
    })
  },

  'OPTIONS': function(req, res) {
    helpers.sendResponse(res, 200, null);
  }
};

exports.handleRequest = helpers.makeActionHandler(actions);