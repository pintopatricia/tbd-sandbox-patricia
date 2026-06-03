import { BettingState } from "@ppb/betslip-core";
import { SportsbookOdds } from "../../entities";
import URN from "../../layout/URN";

type GenericMetadataType = "GENERIC";
type RacingMetadataType = "RACING";
export type MetadataType = GenericMetadataType | RacingMetadataType;

export type BettingGroup = "VIRTUAL" | "REAL";

export type AddLegOptions = {
  isBoostedLeg: boolean;
  groupId?: string;
};

export type RacingBettingMetadata = {
  urn: URN;
  time: string;
  venue: string;
  saddleCloth?: string;
  runnerVisual?: string;
  meetingCountry?: string;
  trap?: number;
};

type BettingBaseMetadata = {
  sportId: number;
  sportName: string;
  marketName: string;
  marketType: string;
  guaranteedPriceAvailable?: boolean;
  marketTypeName: string | null;
  is90Min: boolean;
  isSuperSub?: boolean;
  bettingGroup: BettingGroup;
  type: MetadataType;
  runnerName: string;
  runnerUrn: string;
  previousOdds?: SportsbookOdds[];
  isOddsboostMarketType?: boolean;
};

export type BettingGenericMetadata = {
  type: GenericMetadataType;
  eventName: string;
  eventUrn: URN;
  eventOpenDate?: string;
  competitionName?: string;
} & BettingBaseMetadata;

export type BettingRacingMetadata = {
  type: RacingMetadataType;
  racing: RacingBettingMetadata;
} & BettingBaseMetadata;

export type BettingMetadata = BettingGenericMetadata | BettingRacingMetadata;

export type RunnersMetadata = {
  [bettingRunnerId: string]: BettingMetadata;
};

export type SportsbookBettingRunnerData = {
  handicap?: number | null;
};

export type SportsbookBettingRunner = BettingState.Runner;
export type SportsbookBettingState = BettingState.Group;
