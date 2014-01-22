'use strict';

require('should');

var office = require('../lib/');
var anyfetchClient = require('anyfetch');
  
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


describe('Test office results', function() {
  // Presentation can't be exported to clean HTML using loffice.
  // Therefore we convert to PDF, and launch a new hydration phase on anyfetch.

  it('returns the correct informations for document', function(done) {
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

      if(document) {
        throw new Error("Document should not be returned");
      }

      count.should.eql(1);
      done();
    });
  });

});

describe('The hydrater', function() {
  it('should handle uppercase in the extensions', function(done) {
  // rtf and RTF should be considered the same extension
    count = 0;
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/text.RTF",
      },
      access_token: "123",
      identifier: "azerty",
    };

    office(__dirname + document.metadatas.path, document, function(err, document) {
      if(err) {
        throw err;
      }

      if(document) {
        throw new Error("Document should not be returned");
      }

      count.should.eql(1);
      done();
    });
  });


  it('should return the correct error when there is no extension', function(done) {
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

  it('should return the correct error when the extension is invalid', function(done) {
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
