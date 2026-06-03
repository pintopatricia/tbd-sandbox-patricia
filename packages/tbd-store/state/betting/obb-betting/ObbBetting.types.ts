export type ObbBettingState = {
  legs: ObbLegMap;
  potentialBets: ObbPotentialBetMap;
  totalStake: number | null;
  totalPotentialReturns: number | null;
  validations: ObbValidations;
  maxPayoutLimits: {
    warning: number | null;
    error: number | null;
  };
  failures: FailuresMap;
};

export type FailuresMap = {
  betslip: string | null;
  potentialBets: Record<string, string>;
  legs: Record<string, string>;
};

export type BetFailure = {
  betResult: string;
  legResults: LegResult[];
  potentialBetId: string;
};

export type LegResult = {
  id: string;
  result: string;
};

export type ObbLegMap = Record<string, ObbLeg>;

export type BetType = "SINGLE";

export type PlaceObbBetLeg = {
  legId: string;
  stakePerLine: number;
  expectedPrice: {
    numerator: number;
    denominator: number;
  };
  legDescription: string;
  templateName: string;
};

export type ObbRequestInput = {
  legs: PlaceObbBetLeg[];
  dryRun: boolean;
  customerRef: string;
};
export type ObbPotentialBetMap = Record<string, ObbPotentialBet>;

export type ObbPotentialBet = {
  id: string;
  betType: BetType;
  legs: string[];
  stake: number | null;
  potentialReturns: number | null;
  quote?: ObbQuote;
  maxStake: number | null;
  minStake: number | null;
  maxPayout: number | null;
  minStakeIncrement: number | null;
};

export type ObbQuote = {
  price: ObbPrice;
};

export type ObbPrice = {
  decimal: number;
  fractional: FractionalOdds;
};

export type FractionalOdds = {
  numerator: number;
  denominator: number;
};

export type ObbEvent = {
  urn: string;
  name: string;
  eventId: number;
};
export type ObbLeg = {
  id: string;
  templateId: string;
  event: ObbEvent;
  quote?: ObbQuote;
  metadata: ObbLegMetadata;
  params: ObbLegParams;
};

export type ObbLegParams = ObbPvpLegParams | ObbXOfNLegParams | ObbSquadBetLegParams | ObbSquadVsSquadBetLegParams;

export type ObbPvpLegParams = {
  outcomeId: string;
  participantIdA: string;
  participantIdB: string;
  timePeriodId: string;
};

export type ObbXOfNLegParams = {
  x: number;
  baseExpressionTemplateDefinitions: BaseExpressionTemplateDefinitions[];
  baseBets: BaseBet[];
};

export type BaseBet = {
  templateId: string;
  params: ObbLegParams;
};

export type ObbSquadBetLegParams = {
  participantIds: string[];
  outcomeIds: string[];
  value: number;
  timePeriodId: string;
  quantifier: string;
};

export type ObbSquadVsSquadBetLegParams = {
  squadAParticipantIds: string[];
  squadBParticipantIds: string[];
  outcomeIds: string[];
  timePeriodId: string;
  quantifier: string;
};

export type BaseExpressionTemplateDefinitions = {
  expressionTemplateId: string;
  baseExpressionTemplateDefinitions?: BaseExpressionTemplateDefinitions[] | null;
};

export type ObbLegMetadata = {
  legDescription: string;
  participantsDescription?: string;
  outcomeDescription?: string;
  legTypeDescription: string;
  obbBettingLegsQuotes?: string;
  eventsNames?: string;
  eventsIds?: string;
  competitionIds?: string;
  competitionNames?: string;
  sportsIds?: string;
  sportsNames?: string;
  tabName?: string;
  layout?: string;
  card?: string;
};

export type ObbValidations = {
  betslip: ObbBetslipValidations[];
  potentialBets: Record<string, ObbPotentialBetsValidations[]>;
};

export type ObbBetslipValidations = AboveMaxPayoutValidation;

export type ObbPotentialBetsValidations =
  | AboveMaxPayoutValidation
  | AboveMaxStakeValidation
  | BelowMinStakeValidation
  | IncrementOutOfRangeValidation;

export type AboveMaxPayoutValidation = {
  type: ObbValidationTypes.ABOVE_MAX_PAYOUT;
  data: MaximumPayoutThresholdMetadata;
  severity: ObbValidationSeverities;
};

export type AboveMaxStakeValidation = {
  type: ObbValidationTypes.ABOVE_MAX_STAKE;
  data: MaximumStakeThresholdMetadata;
  severity: ObbValidationSeverities;
};

export type BelowMinStakeValidation = {
  type: ObbValidationTypes.BELOW_MIN_STAKE;
  data: MinimumStakeThresholdMetadata;
  severity: ObbValidationSeverities;
};

export type IncrementOutOfRangeValidation = {
  type: ObbValidationTypes.INCREMENT_OUT_OF_RANGE;
  data: IncrementOutOfRangeMetadata;
  severity: ObbValidationSeverities;
};

export type MaximumPayoutThresholdMetadata = {
  currentPayout: number;
  max: number;
};

export type MaximumStakeThresholdMetadata = {
  currentStake: number;
  max: number;
};

export type MinimumStakeThresholdMetadata = {
  currentStake: number;
  min: number;
};

export type IncrementOutOfRangeMetadata = {
  currentStake: number;
  closest: number;
};

export enum ObbValidationTypes {
  ABOVE_MAX_PAYOUT = "ABOVE_MAX_PAYOUT",
  ABOVE_MAX_STAKE = "ABOVE_MAX_STAKE",
  BELOW_MIN_STAKE = "BELOW_MIN_STAKE",
  INCREMENT_OUT_OF_RANGE = "INCREMENT_OUT_OF_RANGE",
}

export enum ObbValidationSeverities {
  ERROR = "ERROR",
  WARNING = "WARNING",
}

export enum Quantifier {
  AT_LEAST = "AT_LEAST",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
}
