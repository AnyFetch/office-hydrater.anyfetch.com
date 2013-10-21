'use strict';

require('should');
var fs = require('fs');

var office = require('../lib/hydrater-office');


describe('Test office results', function() {
  it('returns the correct informations', function(done) {
    var document = {
      metadatas: {}
    };

    office(__dirname+"/samples/test1.pptx", document, function(err, document) {
      if(err) {
        throw err;
      }
      document.should.have.property('metadatas');
      //document.should.have.property('binary_document_type', "office-html");
      document.metadatas.should.have.property('html');
      document.metadatas.html
        .should.include('Game Design');
      done();
    });


    office(__dirname+"/samples/test2.docx", document, function(err, document) {
      if(err) {
        throw err;
      }
      document.should.have.property('metadatas');
      //document.should.have.property('binary_document_type', "office-html");
      document.metadatas.should.have.property('html');
      document.metadatas.html
        .should.include('purpose of this document');
      done();
    });
  });
});
