const styles = require("./SportsbookExpandableLegCardGroup.web.modules.json");

const SBK_EXPANDABLE_LEG_CARD_GROUP = styles.container;
const SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS = `${SBK_EXPANDABLE_LEG_CARD_GROUP} ${styles.card}`;
const SBK_EXPANDABLE_LEG_CARD_GROUP_COLLAPSE_TEXT = styles.collapseHeaderText;

module.exports = {
  SBK_EXPANDABLE_LEG_CARD_GROUP,
  SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS,
  SBK_EXPANDABLE_LEG_CARD_GROUP_COLLAPSE_TEXT,
};
