import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";

import { ComponentProps } from "./props";

import ExchangeOnboardingBottomSheet from "./ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.web";
import Storage from "../../helpers/storage.web";

const EXCHANGE_ONBOARDING_STORAGE_KEY = "wasExchangeOnboardingShown";

const ExchangeOnboarding: FunctionComponent<ComponentProps> = ({
  i18nLabels: { bottomSheetDescription, bottomSheetTitle, bottomSheetDismissButton },
  canShowExchangeOnboarding,
}) => {
  const [showOnboardingBottomSheet, setShowOnboardingBottomSheet] = useState<boolean>(false);

  useEffect(() => {
    Storage.getItem(EXCHANGE_ONBOARDING_STORAGE_KEY).then((wasShown) => {
      if (!wasShown) {
        setShowOnboardingBottomSheet(true);
      }
    });
  }, [setShowOnboardingBottomSheet]);

  const onBottomSheetDismiss = useCallback(() => {
    setShowOnboardingBottomSheet(false);
    Storage.setItem(EXCHANGE_ONBOARDING_STORAGE_KEY, true);
  }, [setShowOnboardingBottomSheet]);

  const ExchangeOnboardingBottomSheetComponent = useMemo(
    () => (
      <ExchangeOnboardingBottomSheet
        title={bottomSheetTitle}
        description={bottomSheetDescription}
        dismissButtonText={bottomSheetDismissButton}
        onDismiss={onBottomSheetDismiss}
      />
    ),
    [bottomSheetTitle, bottomSheetDescription, bottomSheetDismissButton, onBottomSheetDismiss],
  );

  if (!canShowExchangeOnboarding || !showOnboardingBottomSheet) {
    return null;
  }

  return ExchangeOnboardingBottomSheetComponent;
};

export default ExchangeOnboarding;
