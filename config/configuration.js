/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";
var defaultPort = 8000;

// URL of pdf hydrater
var defaultPdfHydraterUrl = "http://pdf.hydrater.anyfetch.com";

// URL of office hydrater
var defaultOfficeHydraterUrl = 'http://office.hydrater.anyfetch.com';

// Number of office instance to run simultaneously per cluster
var defaultConcurrency = 1;

if(node_env === "production") {
  defaultPort = 80;
}

// Exports configuration
module.exports = {
  env: node_env,
  port: process.env.PORT || defaultPort,
  concurrency: process.env.OFFICE_CONCURRENCY || defaultConcurrency,
  pdfHydraterUrl: process.env.PDF_HYDRATER_URL ||defaultPdfHydraterUrl,
  officeHydraterUrl: process.env.OFFICE_HYDRATER_URL || defaultOfficeHydraterUrl
};
