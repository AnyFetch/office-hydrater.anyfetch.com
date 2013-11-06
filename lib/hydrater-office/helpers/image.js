'use strict';
var fs = require('fs');

/**
 * Retrieve all <IMG tags, find the image, base64 encode it and returns an array of images.
 */
module.exports = function(html, basePath, cb) {
  // Import external resources
  var stack = [];
 
  var matches = html.match(/<IMG SRC="([^"]+)"/g);

  if(!matches) {
    return cb({});
  }

  matches.forEach(function(match) {
    var path = '/tmp/' + match.replace("<IMG SRC=", '').replace('"', '');
    stack.push(function(cb) {
      fs.readFile(path, function(err, data) {
        cb();
      });
    });
  });
  cb({});
};
