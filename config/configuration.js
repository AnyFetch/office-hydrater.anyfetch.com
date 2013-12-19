/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";
var default_port = 8000;

var default_office_version = "4.0";

// Number of office instance to run simultaneously per cluster
var default_concurrency = 1;

if(node_env === "production") {
  default_port = 80;
}

// Exports configuration
module.exports = {
  env: node_env,
  port: process.env.PORT || default_port,
  office_version: process.env.OFFICE_VERSION || default_office_version,
  concurrency: process.env.OFFICE_CONCURRENCY || default_concurrency
};
