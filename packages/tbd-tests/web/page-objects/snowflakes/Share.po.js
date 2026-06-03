const { BOTTOM_SHEET_CONTAINER } = require("@ppb/the-wall-web/components/walls/BottomSheet/BottomSheet.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { SECONDARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/BetSharingCardGroup/snowflakes/Share/Share.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SharePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(BOTTOM_SHEET_CONTAINER));
  }

  get shareContainer() {
    return this.element.$(TEST_ID);
  }

  get primaryAction() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get secondaryAction() {
    return this.element.$(SECONDARY_BUTTON);
  }
}

module.exports = SharePO;
