var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(target, callback) {
  exports.readListOfUrls(function(urlsArray) {
    callback(urlsArray.indexOf(target) > -1);
  });
};

exports.addUrlToList = function(url, callbackIfSuccess, callbackIfError, callbackIfAlreadyInFile) {
  exports.isUrlInList(url, function(bool) {
    if (!bool) {
      fs.appendFile(exports.paths.list, url + '\n', function(err) {
        if (err) {
          if (callbackIfError) {
            callbackIfError(err);
          }
        } else {
          callbackIfSuccess();
        }
      })
    } else {
      callbackIfAlreadyInFile();
    }
  })
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(exports.paths.archivedSites + '/' + url, function(err, stats) {
    callback(!err);
  })
};

exports.downloadUrls = function(urlsArray) {
  _.each(urlsArray, function(url) {
    fs.open(exports.paths.archivedSites + '/' + url, 'w', function(err, fd) {
      if (!err) {
        fs.write(fd, "empty", function(err) {
          if (!err) {
            fs.close(fd, null);
          }
        });
      }
    })
  })
};
