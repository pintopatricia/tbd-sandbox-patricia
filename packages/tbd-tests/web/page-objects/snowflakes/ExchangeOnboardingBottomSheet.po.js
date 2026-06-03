const BottomSheetPO = require("../components/bottom-sheet.po");
const {
  IMAGE,
  DESCRIPTION,
} = require("@ppb/tbd-shared/components/ExchangeOnboarding/ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.web.selectors");

module.exports = class ExchangeOnboardingBottomSheetPO extends BottomSheetPO {
  constructor(lazyElement) {
    super(lazyElement);
  }

  get image() {
    return this.element.$(IMAGE);
  }

  get description() {
    return this.element.$(DESCRIPTION);
  }
};
