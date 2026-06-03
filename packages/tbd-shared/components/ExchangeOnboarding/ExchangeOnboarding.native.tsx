import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import Storage from "../../helpers/storage.native";
import { ComponentProps } from "./props";

import ExchangeOnboardingBottomSheet from "./ExchangeOnboardingBottomSheet/ExchangeOnboardingBottomSheet.native";
import { TEST_ID } from "./ExchangeOnboarding.native.selectors";

const EXCHANGE_ONBOARDING_STORAGE_KEY = "wasExchangeOnboardingShown";

export const ExchangeOnboarding: FunctionComponent<ComponentProps> = ({
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

  return (
    <View {...getTestProps(TEST_ID, false)}>{showOnboardingBottomSheet && ExchangeOnboardingBottomSheetComponent}</View>
  );
};
