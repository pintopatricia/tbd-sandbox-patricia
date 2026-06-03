"use strict";

/**
 * Disclose PPB's service-to-service tokens to the remote http endpoint.
 *
 * use-cases: PPB admin service-to-service communication
 */
module.exports = Object.freeze({
  "x-administrator": "sessionId",
  "x-ip": "ip",
  "x-uuid": "uuid",
  "x-application": "appKey",
});
