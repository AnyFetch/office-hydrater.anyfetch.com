'use strict';

require('should');

var office = require('../lib/hydrater-office');


describe('Test office results', function() {
  it('returns the correct informations for text docx', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/text.docx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('binary_document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('purpose of this document');
      done();
    });
  });

  it('returns the correct informations for image doc', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/image.doc", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('binary_document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('Sample document created with MS Word');
      document.datas.html.should.include('[image stripped]');
      done();
    });
  });

  it.skip('returns the correct informations for pptx', function(done) {
    var document = {
      datas: {}
    };

    office(__dirname + "/samples/test2.pptx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('binary_document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('Game Design');
      done();
    });
  });
});
