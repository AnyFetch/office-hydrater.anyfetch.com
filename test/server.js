'use strict';

require('should');

var async = require("async");
var url = require('url');
var rarity = require("rarity");
var fs = require('fs');
var restify = require('restify');
var request = require('supertest');



describe('Test office results', function() {
  // Update our pdf hydrater
  process.env.PDF_HYDRATER_URL = 'http://localhost:1337';
  process.env.OFFICE_HYDRATER_URL = 'http://localhost:1339';
  var officeHydrater = require('../app.js');

  before(function() {
    officeHydrater.listen(1339);
  });
  after(function(done) {
    officeHydrater.close(done);
  });

  it('should call the pdf hydrater before sending results', function(done) {

    var pdfHydrater = restify.createServer();
    pdfHydrater.use(restify.queryParser());
    pdfHydrater.use(restify.bodyParser());

    pdfHydrater.post('/hydrate', function(req, res, next) {
      try {
        req.params.should.have.property('priority', 100);
      }
      catch(e) {
        return done(e);
      }

      async.waterfall([
        function downloadFile(cb) {
          var parts = url.parse(req.params.file_path);
          request(parts.protocol + '//' + parts.host)
            .get(parts.path)
            .expect(200)
            .end(rarity.slice(1, cb));
        },
        function sendResults(cb) {
          var parts = url.parse(req.params.callback);

          request(parts.protocol + '//' + parts.host)
            .post(parts.path)
            .send({
              pdf: true
            })
            .end(rarity.slice(1, cb));
        },
        function sendData(cb) {
          res.send(202);
          cb();
        }
      ], function(err) {
        if(err) {
          return done(err);
        }
        next();
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
        priority: 100,
        file_path: 'http://localhost:1338/document',
        callback: 'http://localhost:1338/callback',
        document: {
          metadata: {
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
    process.env.PDF_HYDRATER_URL = 'http://localhost:1337';
    process.env.OFFICE_HYDRATER_URL = 'http://localhost:1339';

    var pdfHydrater = restify.createServer();
    pdfHydrater.use(restify.queryParser());
    pdfHydrater.use(restify.bodyParser());

    pdfHydrater.post('/hydrate', function(req, res, next) {
      var parts = url.parse(req.params.file_path);
      request(parts.protocol + '//' + parts.host)
        .get(parts.path)
        .expect(200)
        .end(function(err, res) {
        if(err) {
          return done(err);
        }

        // Check we have a valid PDF
        try {
          res.text.should.containDeep("Transparency/CS/DeviceRGB");
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
          metadata: {
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
