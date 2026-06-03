const {
  PAGE_HEADER,
  PAGE_HEADER_ICON,
  PAGE_HEADER_TITLE,
  PAGE_HEADER_TITLE_CONTAINER,
  PAGE_HEADER_SUBTITLE,
} = require("@ppb/the-wall-native/components/PageHeader/PageHeader.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class PageHeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PAGE_HEADER}`));
  }

  get pageHeaderIcon() {
    return this.element.$(`~${PAGE_HEADER_ICON}`);
  }

  get pageHeaderTitle() {
    return this.element.$(`~${PAGE_HEADER_TITLE}`);
  }

  get pageHeaderTitleContainer() {
    return this.element.$(`~${PAGE_HEADER_TITLE_CONTAINER}`);
  }

  get pageHeaderSubtitle() {
    return this.element.$(`~${PAGE_HEADER_SUBTITLE}`);
  }
}

module.exports = PageHeaderSO;
