type OnDismissCallback = () => void;

export type ExchangeOnboardingTooltipViewModel = {
  title: string;
  onDismiss: OnDismissCallback;
};

export type ExchangeOnboardingBottomSheetViewModel = {
  title: string;
  description: string;
  dismissButtonText: string;
  onDismiss: OnDismissCallback;
};
