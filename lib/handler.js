'use strict';

var fs = require('fs');

module.exports = function(req, res, next) {
  var path = '/tmp/' + req.params.path.replace(/\.\./g, '');

  var stream = fs.createReadStream(path).pipe(res);
  stream.on('error', function(err) {
    fs.unlink(path);
    next(err);
  });

  stream.on('end', function() {
    setTimeout(function() {
      fs.unlink(path);
    }, 300);

    next();
  });
};

