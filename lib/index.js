'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var async = require('async');
var shellExec = require('child_process').exec;
var request = require('request');
var async = require('async');
var pdfHydrater = require('../config/configuration.js').pdf_hydrater_url;
var officeHydrater = require('../config/configuration.js').office_hydrater_url;

var fileName;

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
};


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
        fileName = path.substr(path.lastIndexOf('/') + 1);
        if(fileName.lastIndexOf('.') !== -1) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }
        
        var options = [
          '--headless',
          '--norestore',
          '--nolockcheck'
        ];
        
        var file = document.metadatas.path.substr(document.metadatas.path.lastIndexOf('/') + 1);
        if (file.lastIndexOf(".") === -1) {
          return cb(new Error("No file extension"));
        }
        
        var fileExtension = file.substr(file.lastIndexOf('.')).toLowerCase();
        if (!extensions[fileExtension]){
          return cb(new Error("Unknown file extension"));
        }
        var converter = extensions[fileExtension];

        var outFile = fileName + '.pdf';
        shellExec('loffice ' + options.join(' ') + ' --convert-to pdf:"' + converter + '" --outdir /tmp ' + path, function(err, stdout, stderr) {
          // err.code to 139 means accessibility errors, we don't really care
          if(err && err.code !== 139) {
            cb(new Error([err, stderr, stdout]));
          }

          document.document_type = "document";

          cb(null, '/tmp/' + outFile);
        });
      }
    },
    function(outPath, cb) {
      var pdfFile = {};
      pdfFile.identifier = document.identifier;
      pdfFile.document_type = "file";
      pdfFile.metadatas = {};
      pdfFile.metadatas.path = (document.metadatas.path || fileName) + ".pdf";

      var payload = {
        file_path: officeHydrater + "/document?path=" + path.replace('/tmp/', ''),
        callback: cb.callbackUrl,
        document: pdfFile
      };

      request(pdfHydrater, cb).post('/hydrate').send(payload);
    }
  ], function(err) {
    // return null document to skip hydration
    cb(err, null);
  });
};
