const {
  SELF_EXCLUSION_DETAILS,
  SELF_EXCLUSION_DETAILS_EMPTY_STATE,
  SELF_EXCLUSION_DETAILS_SAFER_GAMBLING,
  SELF_EXCLUSION_DETAILS_CONTACT,
} = require("@ppb/tbd-components-navigation/components/SelfExclusionCard/view/snowflakes/SelfExclusion/SelfExclusion.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SelfExclusionPo extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${SELF_EXCLUSION_DETAILS}"]`));
  }

  get emptyState() {
    return this.element.$(`[data-testid="${SELF_EXCLUSION_DETAILS_EMPTY_STATE}"]`);
  }

  get saferGambling() {
    return this.element.$(`[data-testid="${SELF_EXCLUSION_DETAILS_SAFER_GAMBLING}"]`);
  }

  get contact() {
    return this.element.$(`[data-testid="${SELF_EXCLUSION_DETAILS_CONTACT}"]`);
  }
}

module.exports = SelfExclusionPo;
