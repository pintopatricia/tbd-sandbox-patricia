const {
  REGULATORY_HEADER_CONTAINER,
  REGULATORY_HEADER_TEXT,
  REGULATORY_HEADER_LINK,
  REGULATORY_HEADER_IMAGE,
  REGULATORY_HEADER_SESSION,
} = require("@ppb/tbd-shared/components/RegulatoryHeader/snowflakes/RegulatoryHeader/RegulatoryHeader.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RegulatoryHeaderSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${REGULATORY_HEADER_CONTAINER}`));
  }

  get headerTextItem() {
    return this.element.$(`~${REGULATORY_HEADER_TEXT}`);
  }

  get headerLinkItem() {
    return this.element.$(`~${REGULATORY_HEADER_LINK}`);
  }

  get headerImageItems() {
    return this.element.$$(`~${REGULATORY_HEADER_IMAGE}`);
  }

  get headerSessionItem() {
    return this.element.$(`~${REGULATORY_HEADER_SESSION}`);
  }
}

module.exports = RegulatoryHeaderSo;
