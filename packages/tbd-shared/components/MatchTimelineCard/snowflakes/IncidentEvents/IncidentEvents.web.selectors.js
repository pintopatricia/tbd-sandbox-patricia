const { TEST_ID: INCIDENT } = require("../Incident/Incident.web.selectors");

const TEST_ID = require("./IncidentEvents.web.modules.json").container;

module.exports = {
  TEST_ID,
  INCIDENT: `${INCIDENT}`,
};
