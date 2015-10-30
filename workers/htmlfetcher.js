var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.archiveTopUrl = function() {
  archive.readListOfUrls(function(urlArray) {
    archive.downloadUrls([urlArray[0]], function(url) {
      var date = (new Date(Date.now())).toString();
      var stringToSave = url + 'correctly archived at: ' + date;
      fs.appendFile(archive.paths.logs, stringToSave + '\n', null)
    });
  });
};