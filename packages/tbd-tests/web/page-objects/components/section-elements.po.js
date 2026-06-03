const { TEST_ID: LINK_LABELS } = require("@ppb/the-wall-web/components/bricks/Link/Link.selectors");
const {
  TEST_ID,
  TITLE,
  CARD,
  ITEMS,
  IMAGES,
  CLOCK,
  LINKS,
  ARROW_ICON,
  SECTION_TITLES,
  CARD_HEADER,
  CARD_ITEMS,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/SectionElements/SectionElements.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SectionElementsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the footer section title element
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Returns the footer section collapsible card element
   * Uses the `CARD` selector
   */
  get card() {
    return this.element.$(CARD);
  }

  /**
   * Returns the footer section collapsible card header element
   * Uses the `CARD_HEADER` selector
   */
  get cardHeader() {
    return this.element.$(CARD_HEADER);
  }

  /**
   * Returns the footer section collapsible card items elements
   * Uses the `CARD_ITEMS` selector
   */
  get cardItems() {
    return this.element.$$(CARD_ITEMS);
  }

  /**
   * Returns the footer section items elements
   * Uses the `IMAGES` selector
   */
  get images() {
    return this.element.$$(IMAGES);
  }

  /**
   * Returns the footer section clock elements
   * Uses the `CLOCK` selector
   */
  get clock() {
    return this.element.$$(CLOCK);
  }

  /**
   * Returns the footer section items elements
   * Uses the `ITEMS` selector
   */
  get items() {
    return this.element.$$(ITEMS);
  }

  /**
   * Returns the group links section items elements
   * Uses the `LINKS` selector
   */
  get links() {
    return this.element.$$(LINKS);
  }

  /**
   * Returns the group links section items elements
   * Uses the `ARROW_ICON` selector
   */
  get arrowIcon() {
    return this.element.$(ARROW_ICON);
  }

  /**
   * Returns the section link labels elements
   * Uses the `LINK_LABELS` selector
   */
  get linkLabels() {
    return this.element.$$(LINK_LABELS);
  }

  /**
   * Returns the section titles elements
   * Uses the `SECTION_TITLES` selector
   */
  get sectionTitles() {
    return this.element.$$(SECTION_TITLES);
  }
}

module.exports = SectionElementsPO;
