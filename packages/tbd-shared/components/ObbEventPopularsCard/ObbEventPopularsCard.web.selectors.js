const { TEST_ID } = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const {
  TEST_ID: MATCH_STAT_SELECTION,
  TITLE: MATCH_STAT_SELECTION_TITLE,
  SUBTITLE: MATCH_STAT_SELECTION_SUBTITLE,
} = require("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web.selectors");
const { TIMES_BACKED_LABEL } = require("../TimesBacked/TimesBacked.web.selectors");
const {
  TEST_ID: CONTEXTUAL_STATS,
} = require("../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web.selectors");
const { TEST_ID: SHOW_MORE } = require("@ppb/the-wall-web/components/bricks/ShowMore/ShowMore.selectors");
const styles = require("./ObbEventPopularsCard.web.modules.json");

module.exports = {
  TEST_ID,
  ITEM: `${TEST_ID} ${styles.cardContainer}`,
  BADGE: `${TEST_ID} ${STATUS_LABEL_LABEL}`,
  MATCH_STAT_SELECTION: `${TEST_ID} ${MATCH_STAT_SELECTION}`,
  MATCH_STAT_SELECTION_TITLE: `${TEST_ID} ${MATCH_STAT_SELECTION_TITLE}`,
  MATCH_STAT_SELECTION_SUBTITLE: `${TEST_ID} ${MATCH_STAT_SELECTION_SUBTITLE}`,
  SHOW_MORE: `${TEST_ID} ${SHOW_MORE}`,
  TIMES_BACKED_LABEL: `${TEST_ID} ${TIMES_BACKED_LABEL}`,
  CONTEXTUAL_STATS: `${TEST_ID} ${CONTEXTUAL_STATS}`,
};
