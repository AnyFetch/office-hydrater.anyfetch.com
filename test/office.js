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

  describe('with error', function() {
    it("should return the correct error when loffice can't hydrate file", function(done) {
      this.timeout(120000);

      var document = {
        metadata: {
          path: "/samples/errored.rtf"
        }
      };

      var changes = anyfetchHydrater.defaultChanges();

      office(__dirname + "/samples/errored.rtf", document, changes, function(err) {
        console.log(changes, err);
        err.should.eql(new HydrationError(":1: parser error : Document is empty\n�p\u0003\u0002�xr�d�gd�\u0006��p\n^\n"));
        done();
      });
    });
  });
});
