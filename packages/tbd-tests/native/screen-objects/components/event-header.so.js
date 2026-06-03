const { EVENT_HEADER, SUBTITLE, TITLE } = require("@ppb/the-wall-native/components/EventHeader/EventHeader.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class EventHeaderSO extends BaseSO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${EVENT_HEADER}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${SUBTITLE}`);
  }
}

module.exports = EventHeaderSO;
