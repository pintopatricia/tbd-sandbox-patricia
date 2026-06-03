const { ICON_CONTAINER, ICON_SILK } = require("@ppb/the-wall-web/components/bricks/SilkWrapper/SilkWrapper.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SilkWrapperPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(ICON_CONTAINER));
  }

  get silkIcon() {
    return this.element.$(ICON_SILK);
  }
}

module.exports = SilkWrapperPO;
