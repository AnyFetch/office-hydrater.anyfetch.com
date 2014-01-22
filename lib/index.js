'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var AnyfetchClient = require('anyfetch');
var async = require('async');

var fileName = "";

var extensions = {
  '.xls': ':"calc_pdf_Export"',
  '.xlsx': ':"calc_pdf_Export"',
  '.ods': ':"calc_pdf_Export"',
  '.doc': ':"writer_web_pdf_Export"',
  '.docx': ':"writer_web_pdf_Export"',
  '.odt': ':"writer_web_pdf_Export"',
  '.rtf': ':"writer_web_pdf_Export"',
  '.ppt': ':"impress_pdf_Export"',
  '.pptx': ':"impress_pdf_Export"',
  '.odp': ':"impress_pdf_Export"',
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
        shellExec('loffice ' + options.join(' ') + ' --convert-to '+ 'pdf' + converter + ' --outdir /tmp ' + path, function(err, stdout, stderr) {
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
      var anyfetchClient = new AnyfetchClient();
      anyfetchClient.setAccessToken(document.access_token);

      var pdfFile = {};
      pdfFile.identifier = document.identifier;
      pdfFile.document_type = "file";
      pdfFile.metadatas = {};
      pdfFile.metadatas.path = fileName + ".pdf";
      // File to send
      var fileConfig = function(){
        return {
          file: fs.createReadStream(outPath),
          filename: document.fileName,
          knownLength: document.length
        };
      };

      anyfetchClient.sendDocumentAndFile(pdfFile, fileConfig, function(err) {
        // Overwrite initial document, to finish properly hydration (without overwriting everything we just made)
        document = null;
        cb(err, outPath);
      });
    },
    function(outPath, cb) {
      fs.unlink(outPath, function() {
        cb();
      });
    }
  ], function(err) {
    cb(err, document);
  });
};
