import { ReactNode } from "react";

import { ActionButtonOnTap, FreeBetsOnChangeCallback, SwitchOnChange } from "@ppb/the-wall-common/types";
import { AlertOnClose } from "@ppb/the-wall-common/types/Alert.types";

type PlaceFooterI18N = {
  balanceAfterBet: string;
  totalReturns: string;
  removeLabel: string;
  freeBetsLabel?: string;
  freeBetsAlertRemoveLabel?: string;
  termsLabel?: string;
  termsLinkLabel?: string;
};

export type PlaceFooterProps = {
  i18n: PlaceFooterI18N;
  isPanelDisabled?: boolean;
  isPlaceDisabled: boolean;
  notifications?: ReactNode;
  footerPrefix?: ReactNode;
  termsUrl?: string;

  // Accept Odds Movement
  showAcceptOddsMovementAlert: boolean;
  isOddsMovementOn: boolean;
  oddsMovementLabels: {
    message: string;
    detailMessage: string;
  };

  // Free Bets
  hasFreeBets?: boolean;
  isFreeBetsSelected?: boolean;
  isFreeBetsDisabled?: boolean;

  // Free Bets Wallets
  freeBetsAlertMessage?: string;

  // Summary
  isSummaryDisabled?: boolean;
  balanceAfterBet?: string;

  totalReturns: string;
  totalOriginalReturns?: string;
  isOddsBoosted?: boolean;

  // Buttons
  hasCTALoading?: boolean;
  hasPlaceError: boolean;
  placeBtnLabel: React.ReactNode;
  placeBtnSecondaryLabel?: string;
  placeBtnLoadingLabel?: string;
  reversePlaceBtnLabels?: boolean;
  isLoggedIn?: boolean;
  secondaryButton?: React.ReactNode;
};

export type PlaceFooterOnPlacePress = ActionButtonOnTap;
export type PlaceFooterOnFreeBetsChange = FreeBetsOnChangeCallback;
export type PlaceFooterOnRemoveAllPress = () => void;

export type PlaceFooterCallbacks = {
  onFreeBetsChange?: PlaceFooterOnFreeBetsChange;
  onFreeBetsRemovePress?: AlertOnClose;
  onRemoveAllPress: PlaceFooterOnRemoveAllPress;
  onPlacePress: PlaceFooterOnPlacePress;
  onOddsMovementPreferencesChange: SwitchOnChange;
};

export type PlaceFooterViewModel = PlaceFooterProps & PlaceFooterCallbacks;
