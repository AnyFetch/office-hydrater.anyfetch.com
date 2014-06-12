'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var async = require('async');
var shellExec = require('child_process').exec;
var nativePath = require('path');
var request = require('request');
var async = require('async');
var config = require('../config/configuration.js');

var hydrationError = require('anyfetch-file-hydrater').hydrationError;

var extensions = {
  '.xls': 'calc_pdf_Export',
  '.xlsx': 'calc_pdf_Export',
  '.ods': 'calc_pdf_Export',
  '.doc': 'writer_pdf_Export',
  '.docx': 'writer_pdf_Export',
  '.odt': 'writer_pdf_Export',
  '.rtf': 'writer_pdf_Export',
  '.ppt': 'impress_pdf_Export',
  '.pptx': 'impress_pdf_Export',
  '.odp': 'impress_pdf_Export',
  '.pps': 'impress_pdf_Export',
  '.ppsx': 'impress_pdf_Export',
};


/**
 * Extract the content in html of the specified document
 *
 * @param {string} path Path of the specified file
 * @param {string} document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, document, changes, cb) {
  var finalCb = cb;

  async.waterfall([
    function(cb) {
      if(!document.metadata || !document.metadata.path) {
        return cb(new hydrationError("Missing metadata.path"));
      }
      else {
        var pdfFile = nativePath.basename(path) + '.pdf';

        var file = nativePath.basename(document.metadata.path);
        var fileExtension = nativePath.extname(file).toLowerCase();

        if (fileExtension === "") {
          return cb(new hydrationError("No file extension"));
        }
        if (!extensions[fileExtension]){
          return cb(new hydrationError("Unknown file extension : " + fileExtension));
        }
        var converter = extensions[fileExtension];

        var options = [
          '--headless',
          '--norestore',
          '--nolockcheck'
        ];

        shellExec('loffice ' + options.join(' ') + ' --convert-to pdf:"' + converter + '" --outdir /tmp ' + path, function(err, stdout, stderr) {
          // err.code to 139 means accessibility errors, we don't really care
          if(err && err.code !== 139) {
            cb(new hydrationError([err, stderr, stdout]));
          }
          cb(null, '/tmp/' + pdfFile);
        });
      }
    },
    function(pdfFile, cb) {
      var pdfDocument = {};
      pdfDocument.identifier = document.identifier;
      pdfDocument.document_type = "document";
      pdfDocument.metadata = {};
      pdfDocument.metadata.path = document.metadata.path;

      var payload = {
        url: config.pdf_hydrater_url,
        json: {
          file_path: config.office_hydrater_url + "/document?path=" + pdfFile.replace('/tmp/', ''),
          callback: finalCb.urlCallback,
          document: pdfDocument
        }
      };

      request.post(payload, cb);
    },
  ], function(err) {
    // return null document to skip hydration
    cb(err, null);
  });
};
