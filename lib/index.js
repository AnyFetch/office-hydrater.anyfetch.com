'use strict';

/**
 * @file Helper for libreOffice file processing
 * For more information about libreoffice :
 * http://www.libreoffice.org/
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var Cluestr = require('cluestr');
var async = require('async');

var image = require('./helpers/image.js');

var xls = ".xls";
var xlsx = ".xlsx";
var ods = ".ods";
var doc = ".doc";
var docx = ".docx";
var odt = ".odt";
var ppt = ".ppt";
var pptx = ".pptx";
var odp = ".odp";


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
        

        var options = [
          '--headless',
          '--norestore',
          '--nolockcheck'
        ];

        var option = '';
        var type = 'html';

        if (path.indexOf(xls, path.length - xls.length) !== -1) {
          option = ':"HTML (StarCalc)"';
        }
        else if (path.indexOf(xlsx, path.length - xlsx.length) !== -1) {
          option = ':"HTML (StarCalc)"';
        }
        else if (path.indexOf(ods, path.length - ods.length) !== -1) {
          option = ':"HTML (StarCalc)"';
        }
        else if (path.indexOf(doc, path.length - doc.length) !== -1) {
          option = ':"HTML (StarWriter)"';
        }
        else if (path.indexOf(docx, path.length - docx.length) !== -1) {
          option = ':"HTML (StarWriter)"';
        }
        else if (path.indexOf(odt, path.length - odt.length) !== -1) {
          option = ':"HTML (StarWriter)"';
        }
        else if (path.indexOf(ppt, path.length - ppt.length) !== -1) {
          type = 'pdf';
          option = ':"writer_web_pdf_Export"';
        }
        else if (path.indexOf(pptx, path.length - pptx.length) !== -1) {
          type = 'pdf';
          option = ':"writer_web_pdf_Export"';
        }
        else if (path.indexOf(odp, path.length - odp.length) !== -1) {
          type = 'pdf';
          option = ':"writer_web_pdf_Export"';
        }
        var outFile = '';
        if (type === "html"){
          outFile = fileName + '.html';
        }
        else  {
          outFile = fileName + '.pdf';
        }

        shellExec('loffice ' + options.join(' ') + ' --convert-to '+ type + option + ' --outdir /tmp ' + path, function(err, stdout, stderr) {
          // err.code to 139 means accessibility errors, we don't really care
          if(err && err.code !== 139) {
            cb(new Error([err, stderr, stdout]));
          }

          cb(null, '/tmp/' + outFile, type);
        });
      }
    },
    function(outPath, type, cb) {
      fs.readFile(outPath, function(err, data) {
        if (type === 'html'){
          data = data.toString();
          // Cleanup datas
          // Retrieve CSS
          var css = data.match(/<style[\S\s]+?<\/style>/i)[0];
          // Remove HTML
          data = data.match(/<body[\S\s]+?>([\S\s]+)<\/body>/i)[1];
          // Reform valid partial document
          data = css + data;
        }
        cb(err, outPath, data, type);
      });
    },
    function(outPath, data, type, cb) {
      if (type === 'html') {
        document.datas.html = data.toString();
      }
      document.document_type = "document";
      cb(null, outPath ,type);
    },
    function(outPath, type, cb) {
      if (type === 'html'){
        image(document.datas.html, '/tmp', function(err, html) {
          document.datas.html = html;
          cb(err, outPath);
        });
      }
      else {
        var cluestr = new Cluestr();
        cluestr.setAccessToken(document.access_token);

        var pdfFile = {};
        pdfFile.identifier = document.identifier;
        pdfFile.metadatas = document.metadatas || {};
        pdfFile.metadatas.mime_type = "application/pdf";
          // File to send
        var fileConfig = function(){
          return {
            file: fs.createReadStream(outPath),
            filename: document.fileName,
            knownLength: document.length
          };
        };

        cluestr.sendDocumentAndFile(pdfFile, fileConfig, function(err) {
          cb(err, outPath);
        });
      }
    },
    function(outPath, cb) {
      console.log ("&",outPath);
      fs.unlink(outPath, function() {
        cb();
      });
    }
  ], function(err) {
    cb(err, document);
  });
};
