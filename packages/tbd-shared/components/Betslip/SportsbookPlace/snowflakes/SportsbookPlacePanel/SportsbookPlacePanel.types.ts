import { ReactNode } from "react";
import {
  ActionButtonOnTap,
  TabsGroupOnTabSwitch,
  FreeBetsOnChangeCallback,
  SwitchOnChange,
} from "@ppb/the-wall-common/types";
import { AlertOnClose, AlertProps } from "@ppb/the-wall-common/types/Alert.types";

type SportsbookPlacePanelI18N = {
  oddsLabel: string;
  stakeLabel: string;
  totalReturns: string;
  multiples: string;
  additionalMultiples: string;
  singles: string;
  removeLabel: string;
  freeBetsLabel?: string;
  bonusAvailabilityLabel?: string;
  oddsMovementUp: string;
  oddsMovementDown: string;
  casts: string;
  eachWay: string;
  eachWaySubtitle?: string;
  betBuilder: string;
  multiBetBuilder: string;
  termsLabel?: string;
  termsLinkLabel?: string;
  freeBetsAlertRemoveLabel?: string;
  balanceAfterBet: string;
  voidBlurbText?: string;
  priceBoosts: string;
  tabAllTitle: string;
  tabBetBuildersTitle: string;
  tabMultiplesTitle: string;
  tabCastTitle: string;
  tabSinglesTitle: string;
  betslipAriaTitle: string;
};

export type SportsbookPlacePanelNotifications = AlertProps[];

export enum BetslipSection {
  bbMulti = "bbMulti",
  betBuilders = "betBuilders",
  oneLineMultiple = "oneLineMultiple",
  multiLinesMultiples = "multiLinesMultiples",
  castBets = "castBets",
  singles = "singles",
}

export enum SportsbookPlacePanelContentLayout {
  ACCORDION = "ACCORDION",
  TABS = "TABS",
}

export type CardContent = {
  card: ReactNode;
  title: string;
  startsOpen: boolean;
  collapsable: boolean;
};

export type BetslipCards = {
  id: string;
  content: CardContent[];
};

export type BetslipCollapsableCards = {
  id: string;
  content: ReactNode[];
};

export type SportsbookPlacePanelCollapsableCardViewModel = {
  title: string;
  card: ReactNode;
  startsOpen: boolean;
  onToggle: SportsbookPlacePanelCallbacks["onCollapseToggle"];
};

export type CollapsablesStartsOpen = {
  [k in BetslipSection]: boolean;
};

export type SportsbookPlacePanelProps = {
  betslipCards: BetslipCards[];
  contentLayout?: SportsbookPlacePanelContentLayout;
  betControlsExperimentVariant?: string;
  isPanelDisabled?: boolean;
  isSummaryDisabled?: boolean;
  isFreeBetsSelected?: boolean;
  isFreeBetsDisabled?: boolean;
  isOddsBoosted?: boolean;
  isOddsMovementOn: boolean;
  showAcceptOddsMovementAlert: boolean;
  oddsMovementLabels: {
    message: string;
    detailMessage: string;
  };
  hasFreeBets?: boolean;
  hasCTALoading?: boolean;
  hasBonusAvailable?: boolean;
  totalReturns: string;
  totalOriginalReturns?: string;
  notifications?: ReactNode;
  hasPlaceError: boolean;
  isPlaceDisabled: boolean;
  footerPrefix?: ReactNode;
  placeBtnLabel: React.ReactNode;
  placeBtnSecondaryLabel?: string;
  placeBtnLoadingLabel?: string;
  reversePlaceBtnLabels?: boolean;
  isDesktop?: boolean;
  i18n: SportsbookPlacePanelI18N;
  secondaryButton?: ReactNode;
  termsUrl?: string;
  freeBetsAlertMessage?: string;
  isLoggedIn?: boolean;
  balanceAfterBet?: string;
  hasMarketBlurbs?: boolean;
  shouldFocusMultiple?: boolean;
  shouldFocusBetBuilder?: boolean;
  shouldFocusCastBet?: boolean;
};

export type SportsbookPlacePanelOnPlaceClick = ActionButtonOnTap;
export type SportsbookPlacePanelOnFreeBetsChange = FreeBetsOnChangeCallback;
export type SportsbookPlacePanelOnRemoveAllClick = () => void;

export type SportsbookPlacePanelCallbacks = {
  onFreeBetsChange?: SportsbookPlacePanelOnFreeBetsChange;
  onPlaceClick: SportsbookPlacePanelOnPlaceClick;
  onRemoveAllClick: SportsbookPlacePanelOnRemoveAllClick;
  onCollapseToggle: (isOpen: boolean) => void;
  onTabSwitch?: TabsGroupOnTabSwitch;
  onFreeBetsRemovePress?: AlertOnClose;
  onOddsMovementPreferencesChange: SwitchOnChange;
};

export type SportsbookPlacePanelViewModel = SportsbookPlacePanelProps & SportsbookPlacePanelCallbacks;

export type SportsbookPlacePanelOrchestratorProps = SportsbookPlacePanelViewModel & {
  isDesktopLayout: boolean;
  hasOnlyOneSingle: boolean;
  hasSingles: boolean;
  hasOneLineMultiple: boolean;
  hasMultipleLinesMultiples: boolean;
  hasMultiBetBuilder: boolean;
  hasCastBets: boolean;
  hasPriceBoost: boolean;
  hasBetBuilders: boolean;
  shouldFocusMultiple?: boolean;
  shouldFocusBetBuilder?: boolean;
  betBuilderIds: string[];
  boostedCombinationIds: string[];
  failedCombinationGroups: number[];
  failedCombinationGroupIds: string[];
};
