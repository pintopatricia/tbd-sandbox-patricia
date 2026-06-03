const styles = require("./SportsbookBetPanel.web.modules.json");

const { TEST_ID: LABEL } = require("@ppb/the-wall-web/components/bricks/Indicators/Label/Label.selectors");
const {
  TEST_ID: SUPPORTING_CONTENT_BUTTON,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const {
  MID_LABEL: STAKE_LABEL,
  MID_VALUE: STAKE,
  RIGHT_LABEL: POTENTIAL_RETURNS_LABEL,
  RIGHT_VALUE_CONTAINER: POTENTIAL_RETURNS,
} = require("@ppb/the-wall-web/components/bricks/BetSegments/BetSegments.selectors");
const { INFO_LABEL_LABEL } = require("@ppb/the-wall-web/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const {
  ITEM_TITLE: FREE_BETS_LABEL,
  ICON: FREE_BETS_ICON,
} = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");

module.exports = {
  TEST_ID: styles.container,
  TITLE: styles.title,
  SUBTITLE: styles.subtitle,
  SUPPORTING_TEXT: styles.supportingText,
  BUTTON: SUPPORTING_CONTENT_BUTTON,
  BOG: `${styles.bog} ${LABEL}`,
  STAKE_LABEL,
  STAKE,
  POTENTIAL_RETURNS_LABEL,
  POTENTIAL_RETURNS,
  FREE_BETS_LABEL,
  FREE_BETS_ICON,
  ODDS_BOOST_LABEL: `${styles.betSegmentInfo} ${INFO_LABEL_LABEL}`,
};
