'use strict';

require('should');

var fs = require('fs');
var restify = require('restify');
var request = require('supertest');
var baseRequest = require('request');

var officeHydrater = require('../app.js');
var config = require('../config/configuration.js');


describe('Test office results', function() {
  before(function() {
    officeHydrater.listen(1339);
  });
  after(function(done) {
    officeHydrater.close(done);
  });

  it('should call the pdf hydrater before sending results', function(done) {
    // Update our pdf hydrater
    officeHydrater.listen(1339);
    config.pdf_hydrater_url = 'http://localhost:1337/hydrate';
    config.office_hydrater_url = 'http://localhost:1339';

    var pdfHydrater = restify.createServer();
    pdfHydrater.use(restify.queryParser());
    pdfHydrater.use(restify.bodyParser());

    pdfHydrater.post('/hydrate', function(req, res, next) {
      baseRequest.get(req.params.file_path, function(err, res) {
        if(err) {
          return done(err);
        }

        var payload = {
          url: req.params.callback,
          json: {
            pdf: true
          }
        };

        baseRequest.post(payload, function(err) {
          res.send(202);
          next(err);
        });
      });
    });
    pdfHydrater.listen(1337);
    
    // Create fake initial server
    var core = restify.createServer();
    core.use(restify.queryParser());
    core.use(restify.bodyParser());
    core.get('/document', function(req, res, next) {
      fs.createReadStream(__dirname + '/samples/text.rtf').pipe(res);
      next();
    });
    core.post('/callback', function(req, res, next) {
      req.params.should.have.property('pdf', true);

      res.send(202);
      next();

      core.close(function() {
        pdfHydrater.close(done);
      });
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

  it('should transform to PDF', function(done) {
    // Update our pdf hydrater
    config.pdf_hydrater_url = 'http://localhost:1337/hydrate';
    config.office_hydrater_url = 'http://localhost:1339';

    var pdfHydrater = restify.createServer();
    pdfHydrater.use(restify.queryParser());
    pdfHydrater.use(restify.bodyParser());

    pdfHydrater.post('/hydrate', function(req, res, next) {
      baseRequest.get(req.params.file_path, function(err, res) {
        if(err) {
          return done(err);
        }

        // Check we have a valid PDF
        try {
          res.body.should.contain("Transparency/CS/DeviceRGB");
        } catch(e) {
          return done(e);
        }
        
        core.close(function() {
          pdfHydrater.close(done);
        });

        res.send(202);
        next(err);
      });
    });
    pdfHydrater.listen(1337);
    
    // Create fake initial server
    var core = restify.createServer();
    core.use(restify.queryParser());
    core.use(restify.bodyParser());
    core.get('/document', function(req, res, next) {
      fs.createReadStream(__dirname + '/samples/text.rtf').pipe(res);
      next();
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
