const {
  FORBIDDEN_CONTENT,
  FORBIDDEN_CONTENT_LABEL_CONTAINER,
} = require("@ppb/tbd-shared/components/ForbiddenContentCard/snowflakes/ForbiddenContent/ForbiddenContent.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ForbiddenContentSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FORBIDDEN_CONTENT}`));
  }

  get label() {
    return this.element.$(`~${FORBIDDEN_CONTENT_LABEL_CONTAINER}`);
  }
}

module.exports = ForbiddenContentSO;
