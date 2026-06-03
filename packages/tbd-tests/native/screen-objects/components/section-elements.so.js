const {
  SECTION_ELEMENTS,
  SECTION_ELEMENTS_ELEMENT,
  SECTION_ELEMENTS_TITLE,
  SECTION_ELEMENTS_IMAGE_ELEMENT,
  SECTION_ELEMENTS_CLOCK_ELEMENT,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/SectionElements/SectionElements.native.selectors");
const { QUICK_LINK_LABEL } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SectionElementsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SECTION_ELEMENTS}`));
  }

  get title() {
    return this.element.$(`~${SECTION_ELEMENTS_TITLE}`);
  }

  get textElements() {
    return this.element.$$(`~${SECTION_ELEMENTS_ELEMENT}`);
  }

  get imageElements() {
    return this.element.$$(`~${SECTION_ELEMENTS_IMAGE_ELEMENT}`);
  }

  get clockElement() {
    return this.element.$(`~${SECTION_ELEMENTS_CLOCK_ELEMENT}`);
  }

  get linkElements() {
    return this.element.$$(`~${QUICK_LINK_LABEL}`);
  }
}

module.exports = SectionElementsSO;
