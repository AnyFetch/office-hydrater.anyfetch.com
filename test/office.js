'use strict';

require('should');

var office = require('../lib/');


describe('Test office results', function() {
  // Presentation can't be exported to clean HTML using loffice.
  // Therefore we convert to PDF, and launch a new hydration phase on anyfetch.

});

describe('The hydrater', function() {
  


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
