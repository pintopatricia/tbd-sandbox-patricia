const { QUICK_LINK } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { QUICK_LINKS, QUICK_LINKS_TITLE, QUICK_LINKS_COLLAPSE_TITLE } = require("./QuickLinksCard.native.selectors");

class QuickLinksCardNativeSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${QUICK_LINKS}`));
  }

  get title() {
    return this.element.$(`~${QUICK_LINKS_TITLE}`);
  }

  get links() {
    return this.element.$$(`~${QUICK_LINK}`);
  }

  get collapseTitle() {
    return this.element.$(`~${QUICK_LINKS_COLLAPSE_TITLE}`);
  }
}

module.exports = QuickLinksCardNativeSo;
