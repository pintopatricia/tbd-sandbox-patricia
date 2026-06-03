const {
  TEST_ID,
  PLAYER_INFO,
  PLAYER_NAME,
  INVERSE,
  LOADING_ICON,
  DISABLED,
  LOADING,
} = require("@ppb/the-wall-web/components/walls/PlayerSelector/PlayerSelector.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PlayerSelectorPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get playerInfo() {
    return this.element.$(PLAYER_INFO);
  }

  get playerName() {
    return this.element.$(PLAYER_NAME);
  }

  get isSelected() {
    return this.element.$$(INVERSE);
  }

  get loadingIcon() {
    return this.element.$(LOADING_ICON);
  }

  get isDisabled() {
    return this.element.$$(DISABLED);
  }

  get isLoading() {
    return this.element.$$(LOADING);
  }
}

module.exports = PlayerSelectorPO;
