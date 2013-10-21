'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;


/**
 * Extract the content in html of the specified document
 *
 * @param {string} path Path of the specified file
 * @param {string} document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, document, cb) {

  async.waterfall([
    function(cb) {
      if(path) {
        var fileName = path.substr(path.lastIndexOf('/') + 1);
        fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        var outFile = fileName + '.html';

        var options = [
          '--headless',
          '--norestore',
          '--nolockcheck'
        ];

        shellExec('loffice ' + options.join(' ') + ' --convert-to html --outdir /tmp/ ' + path, function(err, stdout, stderr) {
          if(err) {
            cb(new Error([err, stderr]));
          }

          cb(err, '/tmp/' + outFile);
        });
      }
    },
    function(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        cb(err, outPath, data);
      });
    },
    function(outPath, data, cb) {
      if(!document.metadatas) {
        document.metadatas = {};
      }

      document.metadatas.html = data.toString();
      document.binary_document_type = "document";
      cb(null, outPath);
    },
    function(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    },
  ], function(err) {
    cb(err, document);
  });
};
