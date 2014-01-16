'use strict';

require('should');

var office = require('../lib/');
var CluestrClient = require('cluestr');

describe('Test office results', function() {

  it('returns the correct informations for text docx', function(done) {
  // Somme loffice version generate uppercase markup, some other generate lowercase.
  // We won't test this here.
    var document = {
      datas: {},
      path: "/samples/text.docx",
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

  it('returns the correct informations for image doc', function(done) {
    var document = {
      datas: {},
      path: "/samples/image.doc",
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

  it('returns the correct informations for odt', function(done) {
    var document = {
      datas: {},
      path: "/samples/text.odt",
    };

    office(__dirname + "/samples/text.odt", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include(' describes many tags and a lot of information that can be');
      done();
    });
  });

  it('returns the correct informations for xls', function(done) {
    var document = {
      datas: {},
      path: "/samples/test.xls",
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

  it('returns the correct informations for xlsx', function(done) {
    var document = {
      datas: {},
      path: "/samples/test.xlsx",
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

  it('returns the correct informations for ods', function(done) {
    var document = {
      datas: {},
      path: "/samples/test.ods",
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

  process.env.CLUESTR_SERVER = 'http://localhost:1338';
  var count = 0;
  var cb = function(url){
    if (url.indexOf("/file") !== -1) {
      count += 1;
    }
  };
  // Create a fake HTTP server
  var apiServer = CluestrClient.debug.createTestApiServer(cb);
  apiServer.listen(1338);

  it('returns the correct informations for pptx', function(done) {
    var document = {
      datas: {},
      metadatas: {},
      access_token: "123",
      identifier: "azerty",
    };

    office(__dirname + "/samples/test.pptx", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.metadatas.mime_type.should.equal("application/pdf");
      count.should.eql(1);
      done();
    });
  });
});
