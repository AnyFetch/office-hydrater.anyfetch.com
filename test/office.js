'use strict';

require('should');

var office = require('../lib/');
var anyfetchFileHydrater = require('anyfetch-file-hydrater');

var hydrationError = anyfetchFileHydrater.hydrationError;

describe('Office hydrater', function() {
  it('should return the correct error when there is no extension', function(done) {
    var document = {
      data: {},
      metadata: {
        path: "/samples/textrtf",
      }
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    office(__dirname + document.metadata.path, document, changes, function(err) {
      err.should.eql(new hydrationError("No file extension"));
      done();
    });
  });

  it('should return the correct error when the extension is invalid', function(done) {
    var document = {
      data: {},
      metadata: {
        path: "/samples/text.fuck",
      }
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    office(__dirname + document.metadata.path, document, changes, function(err) {
      err.should.eql(new hydrationError("Unknown file extension : .fuck"));
      done();
    });
  });

  it('should return the correct error when there is no path', function(done) {
    var document = {
      data: {},
    };

    var changes = anyfetchFileHydrater.defaultChanges();

    office(__dirname + "/samples/text.rtf", document, changes, function(err) {
      err.should.eql(new hydrationError("Missing metadata.path"));
      done();
    });
  });
});
