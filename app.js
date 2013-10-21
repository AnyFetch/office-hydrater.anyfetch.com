'use strict';

// Load configuration and initialize server
var cluestrFileHydrater = require('cluestr-file-hydrater');

var config = require('./config/configuration.js');
var office = require('./lib/hydrater-office');

var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: office
};

var server = cluestrFileHydrater.createServer(serverConfig);

// Expose the server
module.exports = server;
