import { ReactNode } from "react";
import { BetSelectionDetailsCommonProps, BetSummaryProps, FallbackIconType } from "@ppb/the-wall-common/types";
import { CollapseProps } from "@ppb/the-wall-common/types/Collapse.types";
import { SelectionsBoardProps } from "@ppb/the-wall-common/types/Betslip/SelectionsBoard.types";
import { CastBetRunnerSelectionProps } from "@ppb/tbd-store";
import { Region } from "@ppb/the-wall-icons/traps";
import { BetBuilderSummary } from "./snowflakes/BetBuilderSummary/BetBuilderSummary.types";
import { BetSportsbookReceiptProps } from "./snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.types";
import { BetSelection } from "./snowflakes/BetSelections/BetSelections.types";

type ReceiptIds = {
  betReceiptId: string;
  regulatorId?: string;
};

export type SportsbookReceiptReUseSelectionsClick = (selections: BetSelection[]) => void;

export type SportsbookReceiptPanelMultiple = Pick<
  BetSummaryProps,
  | "title"
  | "odds"
  | "stake"
  | "returns"
  | "hasAccaInsurance"
  | "hasMyOddsBoost"
  | "hasBonusUsed"
  | "freeBetsLabel"
  | "generosityAlertMessage"
  | "generosityIconName"
  | "hasEachWay"
  | "lines"
  | "previousValue"
  | "previousOdds"
> &
  ReceiptIds;

export type SportsbookReceiptPanelCastBet = {
  title: string;
  subtitle: string;
  selections: CastBetRunnerSelectionProps[];
  lines: number;
  stake: string;
  returns: string;
} & Pick<BetSummaryProps, "hasBonusUsed" | "freeBetsLabel" | "generosityAlertMessage" | "generosityIconName"> &
  ReceiptIds;

export type SportsbookReceiptPanelMultiBetBuilder = Pick<
  BetSummaryProps,
  | "odds"
  | "stake"
  | "returns"
  | "hasMyOddsBoost"
  | "previousValue"
  | "previousOdds"
  | "hasBonusUsed"
  | "freeBetsLabel"
  | "generosityAlertMessage"
  | "generosityIconName"
> &
  Pick<SelectionsBoardProps, "title"> &
  ReceiptIds;

type SportsbookReceiptPanelMultiBetBuilderSelection = {
  id: string;
  title: BetSelectionDetailsCommonProps["title"];
  subtitle: BetSelectionDetailsCommonProps["subtitle"];
  is90Min: BetSelectionDetailsCommonProps["is90Min"];
  selectionTypeIcon?: BetSelectionDetailsCommonProps["selectionTypeIcon"];
  icon?: string;
  silkFallbackType?: FallbackIconType;
  racingSport?: number;
  meetingCountry?: Region;
  trap?: string | number;
};

type SportsbookReceiptPanelMultiBetBuilderGroup = {
  urn: string;
  title: string;
  selections: SportsbookReceiptPanelMultiBetBuilderSelection[];
};

export type SportsbookReceiptPanelMultiBetBuilderGroups = {
  [urn: string]: SportsbookReceiptPanelMultiBetBuilderGroup;
};
export type SportsbookReceiptPanelBetBuilder = BetBuilderSummary & ReceiptIds;
export type SportsbookReceiptPanelSelection = BetSelection;

export type SportsbookReceiptPanelOneLegBet = Pick<
  BetSportsbookReceiptProps,
  | "title"
  | "subtitle"
  | "odds"
  | "profitOrLiability"
  | "stake"
  | "hasBonusUsed"
  | "freeBetsLabel"
  | "generosityAlertMessage"
  | "selectionTypeIcon"
  | "runners"
> &
  ReceiptIds;

export type SportsbookReceiptPanelSingle = Pick<
  BetSportsbookReceiptProps,
  | "title"
  | "subtitle"
  | "odds"
  | "previousOdds"
  | "segmentsIcon"
  | "boostedInfo"
  | "stake"
  | "profitOrLiability"
  | "previousProfitOrLiability"
  | "hasBonusUsed"
  | "freeBetsLabel"
  | "generosityAlertMessage"
  | "generosityIconName"
  | "icon"
  | "meetingCountry"
  | "trap"
  | "silkFallbackIconType"
  | "silkIconAlt"
  | "racingSport"
  | "hasEachWay"
  | "eachWaySubtitle"
  | "hasMyOddsBoost"
  | "isPriceBoosted"
  | "is90Min"
  | "selectionTypeIcon"
  | "isGuaranteedPriceSelected"
  | "isPushNotificationsUnavailable"
  | "isOddsboostMarketType"
> &
  ReceiptIds;

type SportsbookReceiptPanelBoostedMultiple = Pick<
  BetSummaryProps,
  | "title"
  | "odds"
  | "stake"
  | "returns"
  | "hasAccaInsurance"
  | "hasBonusUsed"
  | "freeBetsLabel"
  | "generosityAlertMessage"
  | "generosityIconName"
> & {
  id: string;
  selections: BetSelection[];
};

export type SportsbookReceiptPanelProps = {
  oneLineBets?: SportsbookReceiptPanelOneLegBet[];
  singles: SportsbookReceiptPanelSingle[];
  multiples: SportsbookReceiptPanelMultiple[];
  boostedMultiples: SportsbookReceiptPanelBoostedMultiple[];
  selections: SportsbookReceiptPanelSelection[];
  casts: SportsbookReceiptPanelCastBet[];
  betBuilders: SportsbookReceiptPanelBetBuilder[];
  multiBetBuilder?: SportsbookReceiptPanelMultiBetBuilder;
  multiBetBuilderGroups?: SportsbookReceiptPanelMultiBetBuilderGroups;
  potentialReturns: string;
  totalOriginalReturns?: string;
  totalStake: string;
  isSummaryDisabled?: boolean;
  i18n: {
    receiptStatusLabel: string;
    boostedMultiplesTitleLabel: string;
    multiplesTitleLabel: string;
    singlesTitleLabel: string;
    castsTitleLabel: string;
    multiBetBuilderTitleLabel: string;
    betBuilderTitleLabel: string;
    selectionsLabel: string;
    oddsLabel: string;
    stakeLabel: string;
    returnsLabel: string;
    totalStakeLabel: string;
    totalReturnsLabel: string;
    eachWayLabel: string;
    linesLabel: string;
    accaInsuranceLabel: string;
    reUseSelectionsLabel: string;
    guaranteedPriceLabel: string;
    betReceiptIdLabel: string;
    regulatorBetIdLabel: string;
    freeBetsAlertRemoveLabel?: string;
    confirmationMessage: string;
  };
  displayAllSubtitleTextSingles?: boolean;
  showReuseSelectionsButton?: boolean;
  hasShownReceiptIds?: boolean;
  hasBoostSignposting?: boolean;
  notificationsSubscription?: ReactNode;
  isDesktop?: boolean;
  isOddsBoosted?: boolean;
  oddsBoostIconName?: string;
  topContent?: ReactNode;
  isTrapIconThrottleActive?: boolean;
};

export type SportsbookReceiptPanelCallbacks = {
  onTitleClick: CollapseProps["onTitleClick"];
  onReUseSelectionsClick: () => void;
  onBetIdCopy: () => void;
  onRegulatorBetIdCopy: () => void;
};

export type SportsbookReceiptPanelViewModel = SportsbookReceiptPanelProps & SportsbookReceiptPanelCallbacks;
