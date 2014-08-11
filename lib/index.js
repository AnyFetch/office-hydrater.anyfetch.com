'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var async = require('async');
var shellExec = require('child_process').exec;
var nativePath = require('path');
var request = require('supertest');
var async = require('async');
var config = require('../config/configuration.js');

var hydrationError = require('anyfetch-hydrater').hydrationError;

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

var contentType = {
  "application/msword": 'writer_pdf_Export',
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 'writer_pdf_Export',
  "application/vnd.ms-excel": 'calc_pdf_Export',
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 'calc_pdf_Export',
  "application/vnd.ms-powerpoint": 'impress_pdf_Export',
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": 'impress_pdf_Export',
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": 'impress_pdf_Export'
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
    function getConverter(cb) {
      var converter;

      if(document.metadata && document.metadata.path) {
        var file = nativePath.basename(document.metadata.path);
        var fileExtension = nativePath.extname(file).toLowerCase();
        if(extensions[fileExtension]) {
          converter = extensions[fileExtension];
        }
      }
      if(document.data && document.data.content_type) {
        if(contentType[document.data.content_type]) {
          converter = contentType[document.data.content_type];
        }
      }

      if(!converter) {
        return cb(new hydrationError("Unknown file extension or content type"));
      }
      else {
        cb(null, converter);
      }
    },
    function convertToPdf(converter, cb) {
      var options = [
        '--headless',
        '--norestore',
        '--nolockcheck'
      ];

      shellExec('loffice ' + options.join(' ') + ' --convert-to pdf:"' + converter + '" --outdir /tmp ' + path, {maxBuffer: 20480 * 1024, timeout: 45000, killSignal: 'SIGKILL'}, function(err, stdout, stderr) {
        // err.code to 139 means accessibility errors, we don't really care
        if(err && err.code !== 139) {
          return cb(new hydrationError([err, stderr, stdout]));
        }

        var pdfFile = nativePath.basename(path) + '.pdf';
        cb(null, '/tmp/' + pdfFile);
      });
    },
    function sendToPdfHydrater(pdfFile, cb) {
      var pdfDocument = {};
      pdfDocument.identifier = document.identifier;
      pdfDocument.document_type = "document";
      pdfDocument.metadata = {};
      pdfDocument.metadata.path = document.metadata.path;

      request(config.pdfHydraterUrl)
        .post('/hydrate')
        .send({
          file_path: config.officeHydraterUrl + "/document?path=" + pdfFile.replace('/tmp/', ''),
          callback: finalCb.urlCallback,
          document: pdfDocument
        })
        .end(cb);
    },
  ], function(err) {
    // return null document to skip hydration
    cb(err, null);
  });
};
