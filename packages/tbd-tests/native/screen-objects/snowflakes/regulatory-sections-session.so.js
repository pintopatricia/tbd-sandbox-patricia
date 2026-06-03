const {
  FOOTER_SESSION,
  FOOTER_SESSION_TEXT,
  FOOTER_SESSION_TIME,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySectionsSession.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RegulatorySectionsSessionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FOOTER_SESSION}`));
  }

  get text() {
    return this.element.$(`~${FOOTER_SESSION_TEXT}`);
  }

  get time() {
    return this.element.$(`~${FOOTER_SESSION_TIME}`);
  }
}

module.exports = RegulatorySectionsSessionSO;
