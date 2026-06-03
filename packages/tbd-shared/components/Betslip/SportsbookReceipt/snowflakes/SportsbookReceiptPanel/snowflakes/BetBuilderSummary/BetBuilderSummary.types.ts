import { GenerosityIconName } from "@ppb/the-wall-common/types/Betslip/GenerosityIcon.types";
import { BetSelection } from "../BetSelections/BetSelections.types";

export type BetBuilderSummaryOnStakeChange = ({ id, newValue }: { id: string; newValue?: number }) => void;
export type BetBuilderSummaryOnStakeBlur = ({ id }: { id: string }) => void;

export type BetBuilderSummary = {
  id: string;
  title: string;
  type: string;
  odds: string;
  returns: string;
  stake: string;
  previousValue?: string;
  previousOdds?: string;
  freeBetsLabel?: string;
  hasBonusUsed: boolean;
  selections: BetSelection[];
  selectionsLabel: string;
  isPushNotificationsUnavailable?: boolean;
  generosityAlertMessage?: string;
  hasMyOddsBoost?: boolean;
  generosityIconName?: GenerosityIconName;
  selectionsToWin?: number;
};

export type BetBuilderSummaryProps = {
  /**
   * An object representing a Bet Builder
   */
  bet: BetBuilderSummary;

  /**
   * All translations labels used by the component
   */
  labels: BetBuilderSummaryLabels;
  hasShownReceiptIds?: boolean;
};

export type BetBuilderSummaryLabels = {
  odds: string;
  stake: string;
  returns: string;
};

export type BetBuilderSummaryViewModel = BetBuilderSummaryProps;
