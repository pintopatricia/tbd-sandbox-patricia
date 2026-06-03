const {
  CAPTION,
  CAPTION_ITEM,
  CAPTION_ITEM_TEXT,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/Caption/Caption.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FootballTeamLineupsCaptionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CAPTION}`));
  }

  get captionItems() {
    return this.element.$$(`~${CAPTION_ITEM}`);
  }

  get captionText() {
    return this.element.$(`~${CAPTION_ITEM_TEXT}`);
  }
}

module.exports = FootballTeamLineupsCaptionSO;
