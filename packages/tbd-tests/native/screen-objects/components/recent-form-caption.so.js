const {
  RECENT_FORM_CAPTION,
  RECENT_FORM_CAPTION_ITEM,
  RECENT_FORM_CAPTION_ITEM_LEFT_LABEL,
  RECENT_FORM_CAPTION_ITEM_RIGHT_LABEL,
} = require("@ppb/the-wall-native/components/RecentForm/RecentFormCaption/RecentFormCaption.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RecentFormCaptionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECENT_FORM_CAPTION}`));
  }

  get items() {
    return this.element.$$(`~${RECENT_FORM_CAPTION_ITEM}`);
  }

  get itemLeftLabel() {
    return this.element.$(`~${RECENT_FORM_CAPTION_ITEM_LEFT_LABEL}`);
  }

  get itemRightLabel() {
    return this.element.$(`~${RECENT_FORM_CAPTION_ITEM_RIGHT_LABEL}`);
  }
}

module.exports = RecentFormCaptionSO;
