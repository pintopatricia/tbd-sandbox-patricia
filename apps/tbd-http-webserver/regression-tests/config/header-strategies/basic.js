"use strict";

/**
 * Disclose PPB's service-to-service tokens to the remote http endpoint.
 *
 * use-cases: PPB service-to-service communication
 */
module.exports = Object.freeze({
  "x-authentication": "sessionId",
  "x-ip": "ip",
  "x-uuid": "uuid",
  "x-application": "appKey",
  "user-agent": "userAgent",
});
