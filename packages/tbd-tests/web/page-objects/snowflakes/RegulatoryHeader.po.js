const {
  TEST_ID,
  REGULATORY_HEADER_TEXT,
  REGULATORY_HEADER_IMAGE,
  REGULATORY_HEADER_SESSION,
  REGULATORY_HEADER_SESSION_LABEL,
  REGULATORY_HEADER_SESSION_TIME,
} = require("@ppb/tbd-shared/components/RegulatoryHeader/snowflakes/RegulatoryHeader/RegulatoryHeader.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RegulatoryHeaderSelector extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get headerTextItem() {
    return this.element.$(REGULATORY_HEADER_TEXT);
  }

  get headerImageItems() {
    return this.element.$$(REGULATORY_HEADER_IMAGE);
  }

  get headerSessionItem() {
    return this.element.$(REGULATORY_HEADER_SESSION);
  }

  get headerSessionItemLabel() {
    return this.element.$(REGULATORY_HEADER_SESSION_LABEL);
  }

  get headerSessionItemTime() {
    return this.element.$(REGULATORY_HEADER_SESSION_TIME);
  }
};
