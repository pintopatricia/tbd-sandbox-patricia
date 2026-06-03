const stylesRaceDetails = require("@ppb/the-wall-web/components/bricks/RaceDetails/RaceDetails.modules.json");
const stylesStickyHeader = require("@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.modules.json");
const styles = require("./RaceDetailsCard.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  RACE_DETAILS: stylesRaceDetails.raceDetails,
  STICKY_HEADER: `${TEST_ID} ${stylesStickyHeader.container}`
};
