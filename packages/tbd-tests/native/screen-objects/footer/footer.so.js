const {
  SECTION_ELEMENTS,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/SectionElements/SectionElements.native.selectors");
const { FOOTER } = require("@ppb/tbd-shared/components/RegulatoryCard/RegulatoryCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FooterSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FOOTER}`));
  }

  get sections() {
    return this.element.$$(`~${SECTION_ELEMENTS}`);
  }
}

module.exports = FooterSO;
