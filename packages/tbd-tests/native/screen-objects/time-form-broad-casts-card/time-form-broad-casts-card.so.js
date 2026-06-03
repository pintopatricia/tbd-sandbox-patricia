const {
  TIME_FORM_BROAD_CASTS,
} = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/TimeFormBroadCastsCard.native.selectors");
const {
  SUPPORTING_CONTENT_BUTTON,
} = require("@ppb/the-wall-native/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TimeFormBroadCastsCardSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIME_FORM_BROAD_CASTS}`));
  }

  get timeformAndBroadcastsButtons() {
    return this.element.$$(`~${SUPPORTING_CONTENT_BUTTON}`);
  }
}

module.exports = TimeFormBroadCastsCardSo;
