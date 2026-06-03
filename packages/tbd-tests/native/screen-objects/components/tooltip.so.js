const {
  TOOLTIP,
  TOOLTIP_BUTTON,
  ICON,
  TITLE,
  DESCRIPTION,
  CLOSE_BUTTON,
  COACH_MARK,
} = require("@ppb/the-wall-native/components/Tooltip/Tooltip.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TooltipSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TOOLTIP}`));
  }

  get tooltipButton() {
    return this.element.$$(`~${TOOLTIP_BUTTON}`);
  }

  get icon() {
    return this.element.$$(`~${ICON}`);
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get description() {
    return this.element.$(`~${DESCRIPTION}`);
  }

  get closeButton() {
    return this.element.$(`~${CLOSE_BUTTON}`);
  }

  get coachMark() {
    return this.element.$(`~${COACH_MARK}`);
  }
}

module.exports = TooltipSO;
