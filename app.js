'use strict';

// Load configuration and initialize server
var anyfetchFileHydrater = require('anyfetch-file-hydrater');

var config = require('./config/configuration.js');
var office = require('./lib/');
var handler = require('./lib/handler.js');

var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: office,
};
if(config.env === "test") {
  serverConfig.logger = function() {};
}

var server = anyfetchFileHydrater.createServer(serverConfig);
server.get('/document', handler);

// Expose the server
module.exports = server;
