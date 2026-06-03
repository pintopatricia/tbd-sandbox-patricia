const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  ODD,
  ODDS_MOVEMENT,
  HINT_MESSAGE,
  HINT_WARNING,
  SELECTION_LINK,
  REMOVE_BUTTON,
  EDIT_BUTTON,
  ICON_90_MIN,
  SELECTION_TYPE_ICON,
  TERTIARY_TITLE,
  RACING_LABEL,
  SIDE,
  SILK,
} = require("@ppb/the-wall-web/components/walls/BetSelectionDetails/BetSelectionDetails.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetSelectionDetailsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get tertiaryTitle() {
    return this.element.$(TERTIARY_TITLE);
  }

  get odd() {
    return this.element.$(ODD);
  }

  get oddsMovement() {
    return this.element.$(ODDS_MOVEMENT);
  }

  get hintMessage() {
    return this.element.$(HINT_MESSAGE);
  }

  get hintWarning() {
    return this.element.$(HINT_WARNING);
  }

  get selectionLink() {
    return this.element.$(SELECTION_LINK);
  }

  get removeButton() {
    return this.element.$(REMOVE_BUTTON);
  }

  get editButton() {
    return this.element.$(EDIT_BUTTON);
  }

  get icon90Min() {
    return this.element.$(ICON_90_MIN);
  }

  get selectionTypeIcon() {
    return this.element.$(SELECTION_TYPE_ICON);
  }

  get racingLabel() {
    return this.element.$(RACING_LABEL);
  }

  get side() {
    return this.element.$(SIDE);
  }

  get silk() {
    return this.element.$(SILK);
  }
}

module.exports = BetSelectionDetailsPO;
