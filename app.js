'use strict';

// Load configuration and initialize server
var anyfetchFileHydrater = require('anyfetch-file-hydrater');

var config = require('./config/configuration.js');
var office = require('./lib/');
var handler = require('./lib/handler.js');

if(config.env === "test") {
  var logger = function() {};
}

var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: office,
  logger: logger
};

var server = anyfetchFileHydrater.createServer(serverConfig);
server.get('/document', handler);

// Expose the server
module.exports = server;
