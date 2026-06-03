import URN from "../../layout/URN";
import { SportsbookOdds } from "../../entities/SportsbookOdds.types";
import { OutcomeDefinitionExp, Participant } from "../../entities/OutcomeDefinition.types";
import { Result, LegType, BetType, ResultType } from "../../constants";
import { BetLegMutation, BetMutation } from "../../../clients/catalogue/catalogue-response-types";

export type SportsbookBet = {
  urn: URN;
  typename: "SportsbookBet";
  betId: string;
  betReceiptId: string;
  isSettled: boolean;
  isEachWay: boolean;
  profitAndLoss?: number;
  originalPotentialWin?: number;
  isOddsBoosted: boolean;
  isLotteries: boolean;
  betType: BetType;
  isSGM: boolean;
  isSGMMulti: boolean;
  isPBM: boolean;
  isPBS: boolean;
  isAccaInsuranceReward: boolean;
  isMoneyBackReward: boolean;
  ghostLegToken: GhostLegToken | null;
  has90MinBet: boolean;
  currentSize: number;
  numLines: number;
  currentSizePerLine: number;
  legs: URN[];
  result: Result | undefined;
  mutations: BetMutation | null;
  betPrice?: SportsbookOdds;
  originalBetPrice?: SportsbookOdds;
  cashoutQuoteURN: URN | undefined;
  bonus?: number;
  product?: BetProduct;
  edges: BetEdge[];
  lowestEventStartTime?: string;
  resultType: ResultType | undefined;
  potentialWinForPlace?: number;
};

export type GhostLegToken = {
  tokenId: string;
  repricedDecimalOdds: number | null;
  payout: number | null;
};

export enum GhostLegStatusEnum {
  Activated = "ACTIVATED",
  CancelledManualCancellation = "CANCELLED_MANUAL_CANCELLATION",
  CancelledManualSettlement = "CANCELLED_MANUAL_SETTLEMENT",
  CancelledVoid = "CANCELLED_VOID",
  IneligibleAllWon = "INELIGIBLE_ALL_WON",
  IneligibleCashout = "INELIGIBLE_CASHOUT",
  IneligibleMultipleLosers = "INELIGIBLE_MULTIPLE_LOSERS",
  Pending = "PENDING",
}

export type BetLeg = {
  urn: URN;
  typename: "BetLeg";
  type: LegType;
  parts: LegPart[];
  result?: Result;
  legNumber: number;
  resultType: ResultType | undefined;
  mutations: (BetLegMutation & { failure?: boolean }) | null;
  outcomeBasedDetails: OutcomeBasedDetails | null;
};

export type LegPart = {
  price: SportsbookOdds | null;
  originalPrice: SportsbookOdds | null;
  priceType?: string;
  eventUrn?: URN;
  eventDescription: string;
  eventMarketDescription: string;
  marketId?: string;
  sportId?: string;
  marketType?: string;
  selectionId?: number;
  selectionName: string;
  marketBetUrn?: URN;
  handicap?: number;
  eachwayFactor?: {
    numerator: number;
    denominator: number;
  };
  eachwayPlaces?: number;
  rule4Deductions?: number;
  deadHeatWinDeductions?: number;
  deadHeatEachwayDeductions?: number;
  outcomeDefinitionExp?: OutcomeDefinitionExp;
  participants?: Participant[];
  isSuperSub: boolean;
  silkUrl?: string;
  expressionComponents?: ExpressionComponents;
  expressionMetadata?: ExpressionMetadata;
  betLegPartType?: string;
  raceRunnerKindUrn?: URN;
  raceUrn?: URN;
};

export type BetEdge = {
  reason: BetEdgeEnum;
  status?: BetEdgeStatusEnum;
};

export type SportsbookBets = {
  [urn: string]: SportsbookBet;
};

export type BetLegs = {
  [urn: string]: BetLeg;
};

export type ObbTemplateParams = ObbPlayerVsPlayerParams | ObbXOfNParams | ObbSquadBetParams | ObbSquadVsSquadBetParams;

export type ObbPlayerVsPlayerParams = {
  outcomeId: string;
  timePeriodId: string;
  participantIdA: string;
  participantIdB: string;
};

export type ObbSquadBetParams = {
  participantIds: string[];
  outcomeIds: string[];
  quantifier: string;
  timePeriodId: string;
  value: number;
};

export type ObbSquadVsSquadBetParams = {
  squadAParticipantIds: string[];
  squadBParticipantIds: string[];
  outcomeIds: string[];
  timePeriodId: string;
  quantifier: string;
};

export type ObbXOfNParams = {
  x: number;
};

export type ObbParticipant = {
  id: string;
  name: string | null;
};

export type OutcomeBasedDetails = {
  expressionInfo: ExpressionInfo;
};

export type ExpressionInfo = {
  templateId: string;
  templateVersion: number;
  params: Parameters;
  result?: Result;
  expressionComponents: ExpressionComponents | null;
  expressionMetadata: ExpressionMetadata | null;
  subExpressionInfos: ExpressionInfo[];
};

export type Parameters = ObbPlayerVsPlayerParams | ObbXOfNParams | ObbSquadBetParams | ObbSquadVsSquadBetParams;

export type ExpressionComponents = {
  leftOperand: Operand[];
  operator: string;
  rightOperand: Operand[];
};

export type Operand = Outcome | Literal | Operator;

export type Outcome = {
  outcomeId: string;
  timePeriodId: string;
  participantId: string;
};

export type Literal = {
  decimal: number;
};

export type Operator = {
  operator: string;
};

export type ExpressionMetadata = {
  participants: ExpressionParticipant[];
};

export type ExpressionParticipant = {
  id: string;
  name: string | null;
};

export enum BetProduct {
  SPORTSBOOK = "SPORTSBOOK",
  VIRTUAL = "VIRTUAL_SPORTS",
  OBB = "OUTCOME_BASED_BETTING",
}

export enum BetEdgeEnum {
  ACCA_INSURANCE = "ACCA_INSURANCE",
  EACHWAY = "EACHWAY",
}

export enum BetEdgeStatusEnum {
  ACTIVE = "ACTIVE",
  VOIDED = "VOIDED",
}
