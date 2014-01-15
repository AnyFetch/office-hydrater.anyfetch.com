'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;

var image = require('./helpers/image.js');

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
        if(fileName.lastIndexOf('.') !== -1) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }
        var outFile = fileName + '.html';

        var options = [
          '--headless',
          '--norestore',
          '--nolockcheck'
        ];
        var xls = ".xls";
        var xlsx = ".xlsx";
        var ods = ".ods";
        var starCalc = '';
        if (path.indexOf(xls, path.length - xls.length) !== -1) {
          starCalc = '":HTML (StarCalc)"';
        }
        else if (path.indexOf(xlsx, path.length - xlsx.length) !== -1) {
          starCalc = '":HTML (StarCalc)"';
        }
        else if (path.indexOf(ods, path.length - ods.length) !== -1) {
          starCalc = '":HTML (StarCalc)"';
        }
        shellExec('loffice ' + options.join(' ') + ' --convert-to html' + starCalc + ' --outdir /tmp ' + path, function(err, stdout, stderr) {
          // err.code to 139 means accessibility errors, we don't really care
          if(err && err.code !== 139) {
            cb(new Error([err, stderr, stdout]));
          }

          cb(null, '/tmp/' + outFile);
        });
      }
    },
    function(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        data = data.toString();
        // Cleanup datas
        // Retrieve CSS
        var css = data.match(/<style[\S\s]+?<\/style>/i)[0];
        // Remove HTML
        data = data.match(/<body[\S\s]+?>([\S\s]+)<\/body>/i)[1];
        // Reform valid partial document
        data = css + data;
        cb(err, outPath, data);
      });
    },
    function(outPath, data, cb) {
      document.datas.html = data.toString();
      document.document_type = "document";
      cb(null, outPath);
    },
    function(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    },
    function(cb) {
      image(document.datas.html, '/tmp', function(err, html) {
        document.datas.html = html;
        cb(err);
      });
    }
  ], function(err) {
    cb(err, document);
  });
};
