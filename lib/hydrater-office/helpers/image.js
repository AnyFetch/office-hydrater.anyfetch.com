'use strict';
var async = require('async');
var fs = require('fs');

/**
 * Retrieve all <IMG tags, find the image on disk and remove it
 */
module.exports = function(html, basePath, cb) {
  // Import external resources
  var stack = [];
 
  var matches = html.match(/<img(.+?)src="([^"]+)"/gi);

  if(!matches) {
    return cb(null, html);
  }

  matches.forEach(function(match) {
    var fileName = match.match(/<img.+?src="([^"]+)"/i)[1];

    // Skip base64 encoding
    if(fileName.substr(0, 5) === 'data:') {
      return;
    }

    var path = '/tmp/' + fileName;
    stack.push(function(cb) {
      fs.unlink(path, cb);
    });
  });

  html = html.replace(/<img[^>]+?>/gi, '<tt>[image stripped]</tt>');

  async.parallel(stack, function(err) {
    cb(err, html);
  });
};
