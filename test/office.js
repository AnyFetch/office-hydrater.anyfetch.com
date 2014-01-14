'use strict';

require('should');

var office = require('../lib/');


describe('Test office results', function() {

  it.skip('returns the correct informations for text docx', function(done) {
  // Somme loffice version generate uppercase markup, some other generate lowercase.
  // We won't test this here.
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/text.docx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('purpose of this document');
      done();
    });
  });

  it.skip('returns the correct informations for image doc', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/image.doc", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('Sample document created with MS Word');
      document.datas.html.should.include('[image stripped]');
      done();
    });
  });

  it('returns the correct informations for xls', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/test.xls", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      
      document.datas.html.should.include('>Fig 2.1</');
      done();
    });
  });

  it.skip('returns the correct informations for xlsx', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/test.xlsx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('>Fig 2.1</');
      done();
    });
  });

  it.skip('returns the correct informations for ods', function(done) {
    var document = {
      datas: {},
    };

    office(__dirname + "/samples/test.ods", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('>Fig 2.1</');
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
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('Game Design');
      done();
    });
  });
});
