'use strict';

require('should');

var office = require('../lib/');


describe('Office hydrater', function() {
  it('should return the correct error when there is no extension', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "/samples/textrtf",
      }
    };

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    office(__dirname + document.metadatas.path, document, changes, function(err) {
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
    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    office(__dirname + document.metadatas.path, document, changes, function(err) {
      err.should.eql(new Error("Unknown file extension"));
      done();
    });
  });
});
