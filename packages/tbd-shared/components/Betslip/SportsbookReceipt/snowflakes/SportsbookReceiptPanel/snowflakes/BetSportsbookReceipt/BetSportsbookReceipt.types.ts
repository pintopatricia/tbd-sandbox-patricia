import { ReactNode } from "react";
import type { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetSegmentsColor, BetSegmentsIcons, FallbackIconType } from "@ppb/the-wall-common/types";
import type { Region } from "@ppb/the-wall-icons/traps";
import { RacingSport } from "@ppb/tbd-store";
import { GenerosityIconName } from "@ppb/the-wall-common/types/Betslip/GenerosityIcon.types";

import { BoostedMarketTypeMap } from "../../../../../../../helpers/boosted-info";

type Runner = {
  runnerURN: string;
  selectionId: number;
  name: string;
  resultType: string | null;
};

export type BetSportsbookReceiptProps = {
  title: string | ReactNode;
  subtitle: string;
  hasBonusUsed?: boolean;
  freeBetsLabel?: string;
  generosityAlertMessage?: string;
  generosityIconName?: GenerosityIconName;
  oddsLabel: string;
  stakeLabel: string;
  profitOrLiabilityLabel: string;
  odds: string;
  stake: string;
  profitOrLiability: string;
  previousProfitOrLiability?: string;
  previousOdds?: string;
  segmentsIcon?: BetSegmentsIcons;
  boostedInfo?: BoostedMarketTypeMap;
  colorIndicator?: BetSegmentsColor;
  icon?: string;
  meetingCountry?: Region;
  trap?: string | number;
  silkIconAlt?: string;
  racingSport?: RacingSport;
  silkFallbackIconType?: FallbackIconType;
  hasEachWay: boolean;
  eachWayLabel: string;
  eachWaySubtitle: string;
  isPriceBoosted: boolean;
  hasMyOddsBoost: boolean;
  isOddsboostMarketType?: boolean;
  isGuaranteedPriceSelected: boolean;
  is90Min?: boolean;
  selectionTypeIcon?: Icons;
  guaranteedPriceLabel: string;
  isPushNotificationsUnavailable?: boolean;
  displayAllSubtitleText?: boolean;
  runners?: Runner[];
};
