'use strict';

// Load configuration and initialize server
var anyfetchHydrater = require('anyfetch-hydrater');

var config = require('./config/configuration.js');
var handler = require('./lib/handler.js');

var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: __dirname + '/lib/index.js',
};
if(config.env === "test") {
  serverConfig.logger = function() {};
}

var server = anyfetchHydrater.createServer(serverConfig);
server.get('/document', handler);

// Expose the server
module.exports = server;
