'use strict';

require('should');

var office = require('../lib/');
var anyfetchHydrater = require('anyfetch-hydrater');

var HydrationError = anyfetchHydrater.HydrationError;

describe('Office hydrater', function() {
  describe('with extension', function() {
    it('should return the correct error when there is no extension', function(done) {
      var document = {
        data: {},
        metadata: {
          path: "/samples/textrtf",
        }
      };

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + document.metadata.path, document, changes, function(err) {
        err.should.eql(new HydrationError("Unknown file extension or content type"));
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

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + document.metadata.path, document, changes, function(err) {
        err.should.eql(new HydrationError("Unknown file extension or content type"));
        done();
      });
    });

    it('should return the correct error when there is no path', function(done) {
      var document = {
        data: {},
      };

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + "/samples/text.rtf", document, changes, function(err) {
        err.should.eql(new HydrationError("Unknown file extension or content type"));
        done();
      });
    });
  });

  describe('with content type', function() {
    it('should return the correct error when there is no content type', function(done) {
      var document = {
        data: {}
      };

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + "/samples/textrtf", document, changes, function(err) {
        err.should.eql(new HydrationError("Unknown file extension or content type"));
        done();
      });
    });

    it('should return the correct error when the content type is invalid', function(done) {
      var document = {
        data: {
          "content-type": "application/tamère"
        },
      };

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + "/samples/textrtf", document, changes, function(err) {
        err.should.eql(new HydrationError("Unknown file extension or content type"));
        done();
      });
    });
  });



});
