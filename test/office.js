'use strict';

require('should');

var office = require('../lib/');
var anyfetchClient = require('anyfetch');

describe('Test office documents results', function() {

  it('returns the correct informations for text docx', function(done) {
  // Somme loffice version generate uppercase markup, some other generate lowercase.
  // We won't test this here.
    var document = {
      datas: {},
      metadatas :{
        path: "/samples/text.docx",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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

  it('returns the correct informations for text rtf', function(done) {
  // Somme loffice version generate uppercase markup, some other generate lowercase.
  // We won't test this here.
    var document = {
      datas: {},
      metadatas :{
        path: "/samples/text.rtf",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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

  it('returns the correct informations for images in doc', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/image.doc",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('[image stripped]');
      done();
    });
  });

  it('returns the correct informations for doc', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/image.doc",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('datas');
      document.should.have.property('document_type', "document");
      document.datas.should.have.property('html');
      document.datas.html.should.include('Sample document created with MS Word');
      done();
    });
  });

  it('returns the correct informations for odt', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/text.odt",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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
});

describe('Test office calc results', function() {
  it('returns the correct informations for xls', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/test.xls",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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
      metadatas: {
        path: "/samples/test.xlsx",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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
      metadatas: {
        path: "/samples/test.ods",
      }
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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
});

describe('Test office presentation results', function() {

  process.env.ANYFETCH_API_URL = 'http://localhost:1338';
  var count = 0;
  var cb = function(url){
    if (url.indexOf("/file") !== -1) {
      count += 1;
    }
  };
  // Create a fake HTTP server
  var apiServer = anyfetchClient.debug.createTestApiServer(cb);
  apiServer.listen(1338);
  after(function(){
    apiServer.close();
  });

  it('returns the correct informations for pptx', function(done) {
    count = 0;
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/test.pptx",
      },
      access_token: "123",
      identifier: "azerty",
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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

  it('returns the correct informations for ppt', function(done) {
    count = 0;
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/test.ppt",
      },
      access_token: "1234",
      identifier: "azertyu",
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
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

  it('returns the correct informations for odp', function(done) {
    count = 0;
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/test.odp",
      },
      access_token: "12345",
      identifier: "azertyui",
    };
    office(__dirname + document.metadatas.path, document, function(err, document) {
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

describe('Test non office results', function() {
  it('returns the correct error when their is no extension', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/textrtf",
      }
    };
    office(__dirname + document.metadatas.path, document, function(err) {
      err.should.eql(new Error("No file extension"));
      done();
    });
  });

  it('returns the correct error when the extension is invalid', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/text.fuck",
      }
    };
    office(__dirname + document.metadatas.path, document, function(err) {
      err.should.eql(new Error("Unknown file extension"));
      done();
    });
  });
});
