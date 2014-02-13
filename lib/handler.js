'use strict';

var fs = require('fs');

module.exports = function(req, res, next) {
  var path = req.params.path.replace(/\.\./g, '');

  var stream = fs.createReadStream('/tmp/' + path).pipe(res);
  stream.on('end', function() {
    setTimeout(function() {
      fs.unlink(req.filePath);
    }, 300);

    next();
  });
};

