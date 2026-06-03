const {
  TEST_ID,
  TITLE,
  CONTENT,
  PARAGRAPH,
  SECTION_LINK,
} = require("@ppb/tbd-shared/components/MarketRulesCard/MarketRules/MarketRulesSection/MarketRulesSection.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketRulesSectionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the title element
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Returns the content element
   * Uses the `CONTENT` selector
   */
  get content() {
    return this.element.$(CONTENT);
  }

  /**
   * Returns the section <p> elements
   */
  get sectionParagraphs() {
    return this.element.$$(PARAGRAPH);
  }

  /**
   * Returns the section <a> elements
   */
  get sectionLinks() {
    return this.element.$$(SECTION_LINK);
  }
}

module.exports = MarketRulesSectionPO;
