'use strict';
var async = require('async');
var fs = require('fs');

/**
 * Retrieve all <IMG tags, find the image on disk and remove it
 */
module.exports = function(html, basePath, cb) {
  // Import external resources
  var stack = [];
 
  var matches = html.match(/<IMG SRC="([^"]+)"/g);

  if(!matches) {
    return cb(null, html);
  }

  matches.forEach(function(match) {
    var fileName = match.replace("<IMG SRC=", '').replace(/"/g, '');
    var path = '/tmp/' + fileName;
    stack.push(function(cb) {
      fs.unlink(path, cb);
    });
  });

  html = html.replace(/<img[^>]+>/gi, '<tt>[image stripped]</tt>');

  async.parallel(stack, function(err) {
    cb(err, html);
  });
};
