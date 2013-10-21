'use strict';

require('should');

var office = require('../lib/hydrater-office');


describe('Test office results', function() {
  it('returns the correct informations for pptx', function(done) {
    var document = {
      metadatas: {}
    };

    office(__dirname + "/samples/test.pptx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('binary_document_type', "document");
      document.metadatas.should.have.property('html');
      document.metadatas.html.should.include('Game Design');
      done();
    });
  });

  it('returns the correct informations for docx', function(done) {
    var document = {
      metadatas: {}
    };

    office(__dirname + "/samples/test.docx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('binary_document_type', "document");
      document.metadatas.should.have.property('html');
      document.metadatas.html.should.include('purpose of this document');
      done();
    });
  });
});
