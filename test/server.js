'use strict';

require('should');

var fs = require('fs');
var restify = require('restify');
var request = require('supertest');

var officeHydrater = require('../app.js');


describe('Test office results', function() {
  var pdfHydrater = restify.createServer();
  pdfHydrater.post('/hydrate', function(req, res, next) {
    process.nextTick(function() {
      request.post(req.callback, {pdf: true});
    });
    res.send(202);
    next();
  });
  pdfHydrater.listen(1337);


  it.only('should call a pdf hydrater before sending results', function(done) {

    // Create fake initial server
    var core = restify.createServer();
    core.get('/document', function(req, res, next) {
      fs.createReadStream(__dirname + '/samples/text.rtf', res);
      next();
    });
    core.post('/callback', function(req, res, next) {
      req.params.pdf.should.equal(true);

      res.send(202);
      next();

      done();
    });

    core.listen(1338);
    request(officeHydrater)
      .post("/hydrate")
      .send({
        file_path: 'http://localhost:1338/document',
        callback: 'http://localhost:1338/callback',
        document: {
          metadatas: {
            path: '/samples/text.rtf'
          }
        }
      })
      .expect(202)
      .end(function(err) {
        if(err) {
          throw err;
        }
      });

  });
});
