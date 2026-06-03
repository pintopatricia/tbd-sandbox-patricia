const {
  TEST_ID,
  TOOLTIP_BUTTON,
  ICON,
  TITLE,
  DESCRIPTION,
  CLOSE_BUTTON,
  COACH_MARK,
} = require("@ppb/the-wall-web/components/walls/Tooltip/Tooltip.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class TooltipPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get tooltipButton() {
    return this.element.$$(TOOLTIP_BUTTON);
  }

  get icon() {
    return this.element.$$(ICON);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get description() {
    return this.element.$(DESCRIPTION);
  }

  get closeButton() {
    return this.element.$(CLOSE_BUTTON);
  }

  get coachMark() {
    return this.element.$(COACH_MARK);
  }
}

module.exports = TooltipPO;
