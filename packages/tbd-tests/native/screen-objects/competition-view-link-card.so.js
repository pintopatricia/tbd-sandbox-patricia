const {
  CIRCULAR_IMAGE_CONTAINER,
  CIRCULAR_IMAGE_TEXT,
} = require("@ppb/tbd-shared/components/CompetitionViewLinkCard/snowflakes/CircularImage/CircularImage.native.selectors");
const {
  COMPETITION_VIEW_LINK_CARD,
} = require("@ppb/tbd-shared/components/CompetitionViewLinkCard/CompetitionViewLinkCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CompetitionViewLinkCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COMPETITION_VIEW_LINK_CARD}`));
  }

  get icon() {
    return this.element.$(`~${CIRCULAR_IMAGE_CONTAINER}`);
  }

  get label() {
    return this.element.$(`~${CIRCULAR_IMAGE_TEXT}`);
  }
}

module.exports = CompetitionViewLinkCardSO;
