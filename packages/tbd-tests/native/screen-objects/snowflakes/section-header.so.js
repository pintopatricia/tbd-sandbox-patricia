const {
  SECTION_HEADER,
  SECTION_HEADER_TITLE,
} = require("@ppb/tbd-shared/components/BrowsePage/snowflakes/SectionHeader/SectionHeader.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SectionHeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SECTION_HEADER}`));
  }

  get title() {
    return this.element.$(`~${SECTION_HEADER_TITLE}`);
  }
}

module.exports = SectionHeaderSO;
