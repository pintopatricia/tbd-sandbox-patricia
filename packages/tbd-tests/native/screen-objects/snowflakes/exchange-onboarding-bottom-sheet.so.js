const BottomSheetSO = require("../components/bottom-sheet.so");
const {
  IMAGE,
  DESCRIPTION,
} = require("@ppb/tbd-shared/components/ExchangeOnboarding/ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.native.selectors");

class ExchangeOnboardingBottomSheetSO extends BottomSheetSO {
  constructor(lazyElement) {
    super(lazyElement);
  }

  get image() {
    return this.element.$(`~${IMAGE}`);
  }

  get description() {
    return this.element.$(`~${DESCRIPTION}`);
  }
}

module.exports = ExchangeOnboardingBottomSheetSO;
