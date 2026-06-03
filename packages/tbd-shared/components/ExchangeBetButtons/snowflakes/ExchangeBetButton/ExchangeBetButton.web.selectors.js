const stylesBetButton = require("../BetButton/BetButton.web.modules.json");
const styles = require("./ExchangeBetButton.web.modules.json");

module.exports = {
  TEST_ID: `${stylesBetButton.betButton}`,
  PRIMARY_LABEL_TEST_ID: `${stylesBetButton.primaryLabel}`,
  SECONDARY_LABEL_TEST_ID: `${stylesBetButton.secondaryLabel}`,
  NOT_DISABLED: `${stylesBetButton.betButton}:not([disabled])`,
  SELECTED: `${stylesBetButton.isSelected}`,
  FLASH_BLUE_ANIMATION: `${styles.flashBlueAnimation}`,
};
