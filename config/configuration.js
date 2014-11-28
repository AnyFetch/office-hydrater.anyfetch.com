/**
 * @file Defines the hydrater settings.
 */

// node_env can either be "development" or "production"
var nodeEnv = process.env.NODE_ENV || "development";
var defaultPort = 8000;

// URL of pdf hydrater
var defaultPdfHydraterUrl = "https://pdf.anyfetch.com";

// URL of office hydrater
var defaultOfficeHydraterUrl = 'https://office.anyfetch.com';

// Number of office instance to run simultaneously per cluster
var defaultConcurrency = 1;

if(nodeEnv === "production") {
  defaultPort = 80;
}

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: process.env.PORT || defaultPort,
  concurrency: process.env.OFFICE_CONCURRENCY || defaultConcurrency,
  pdfHydraterUrl: process.env.PDF_HYDRATER_URL || defaultPdfHydraterUrl,
  officeHydraterUrl: process.env.OFFICE_HYDRATER_URL || defaultOfficeHydraterUrl,
  redisUrl: process.env.REDIS_URL,
  appName: process.env.APP_NAME || "office-hydrater",

  opbeat: {
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    appId: process.env.OPBEAT_APP_ID,
    secretToken: process.env.OPBEAT_SECRET_TOKEN
  }
};
