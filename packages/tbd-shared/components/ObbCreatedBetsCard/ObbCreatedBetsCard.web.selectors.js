const {
  TEST_ID: MATCH_STAT_SELECTION,
  TITLE: MATCH_STAT_SELECTION_TITLE,
  SUBTITLE: MATCH_STAT_SELECTION_SUBTITLE,
} = require("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web.selectors");

const {
  TEST_ID: CONTEXTUAL_STATS,
} = require("../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web.selectors");

const styles = require("./ObbCreatedBetsCard.web.modules.json");

module.exports = {
  CARD: `${styles.card}`,
  HEADER: `${styles.header}`,
  FOOTER: `${styles.footer}`,
  OUTCOMES_CONTAINER: `${styles.outcomesContainer}`,
  SEE_ALL_CONTAINER: `${styles.seeAllContainer}`,
  MATCH_STAT_SELECTION: `${MATCH_STAT_SELECTION}`,
  MATCH_STAT_SELECTION_TITLE: `${MATCH_STAT_SELECTION_TITLE}`,
  MATCH_STAT_SELECTION_SUBTITLE: `${MATCH_STAT_SELECTION_SUBTITLE}`,
  CONTEXTUAL_STATS: `${CONTEXTUAL_STATS}`,
};
