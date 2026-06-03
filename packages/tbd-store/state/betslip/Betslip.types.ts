import { PriceLadderValidation, SizeLadderValidation } from "@ppb/bet-engine";
import { PlaceResult, BettingState } from "@ppb/betslip-core";

import { ExchangeBetTransactionError } from "../betting/ExchangeBetTransactionError.types";
import { BettingGroup, RunnersMetadata } from "../betting/sportsbook-betting/SportsbookBetting.types";
import URN from "../layout/URN";

import {
  MarketRunner,
  ExchangeRunner,
  ExchangePersistenceType,
  ExchangeMarket,
  Race,
  RaceRunners,
  Meeting,
  SportEvent,
  SportsbookOdds,
  Sport,
  RacingSport,
} from "../entities";
import { ExchangeSide } from "../betting/exchange-bets/ExchangeBet.types";
import { BetslipType, FallbackIconType } from "../constants";
import {
  FailuresMap,
  FractionalOdds,
  ObbEvent,
  ObbLegMap,
  ObbLegMetadata,
  ObbPotentialBetMap,
} from "../betting/obb-betting/ObbBetting.types";
import {
  BetDefinitionResult,
  CombinedBetDefinitionResult,
  ObbQuote,
} from "../../clients/catalogue/catalogue-response-types";

export type ActiveProduct = "NONE" | "EXCHANGE" | "SPORTSBOOK";
export type BetslipSubType = "EXCHANGE" | "SPORTSBOOK_SINGLES" | "SPORTSBOOK_MULTIPLES";

export type BetslipStep =
  | "PLACE_POTENTIAL"
  | "EDIT_POTENTIAL"
  | "CONFIRM_POTENTIAL"
  | "REPORT"
  | "EDIT_UNMATCHED"
  | "CANCEL_BET";

type BetslipGenericHierarchyType = "GENERIC";
type BetslipRacingHierarchyType = "RACING";
export type BetslipHierarchyType = BetslipGenericHierarchyType | BetslipRacingHierarchyType;

export type ExchangeBaseRunnerTree = {
  type: BetslipHierarchyType;
  runner: ExchangeRunner;
  marketRunner: MarketRunner;
  market: ExchangeMarket;
  sport: Sport;
};

export type ExchangeRacingRunnerTree = {
  type: BetslipRacingHierarchyType;
  race: Race;
  raceRunners?: RaceRunners;
  meeting: Meeting;
} & ExchangeBaseRunnerTree;

export type ExchangeGenericRunnerTree = {
  type: BetslipGenericHierarchyType;
  event: SportEvent;
} & ExchangeBaseRunnerTree;

export type ExchangeRunnerTree = ExchangeRacingRunnerTree | ExchangeGenericRunnerTree;

export type PlacedBetValues = {
  price: number;
  size: number;
  profit?: number;
  liability?: number;
  persistenceType?: string;
  betId?: string;
  totalBonusUsed?: number;
};

export type CancelledBetValues = {
  price: number;
  size: number;
  profit?: number;
  liability?: number;
  betId?: string;
  totalBonusUsed?: number;
};

export type ExchangeReportRunnerMetadata = {
  runnerTree: ExchangeRunnerTree;
};

export type SportsbookReportRunnerMetadata = {
  runnerName: string;
  marketName: string;
  eventName: string;
};

export type BetslipExchangeReport = {
  side: ExchangeSide;
  betIds?: string[];
  runner: URN;
  metadata: ExchangeReportRunnerMetadata;
  matched?: PlacedBetValues;
  unmatched?: PlacedBetValues;
  cancelled?: CancelledBetValues;
  priceAtSelection?: number;
};

export type BetslipSportsbookReport = {
  metadata: RunnersMetadata;
  result: PlaceResult.PlacedBetResults;
  isFreeBetsSelected: boolean;
};

export type BetslipObbPlaceBetResponse = {
  obbPlaceBet: BetslipObbPlaceBetResponseData;
};

export type BetslipObbPlaceBetResponseData = {
  betPlacementsResult: BetPlacementResult[];
  result: ObbResult;
};

export type ObbResult = {
  errorDetails: string | null;
  resultCode: string;
};

export type BetPlacementResult = {
  betDetails: BetDetails | null;
  id: string;
  result: ObbResult & { legResults: ObbResult[] };
};

export type LegResults = {
  urn: string;
  result: string;
};

export type BetDetails = {
  id: string;
  receiptId: string;
  betType: string;
  placedDate: string;
  stake: number;
  stakePerLine: number;
  potentialPayout: number | null;
  price: {
    fractional: FractionalOdds;
    decimal: number;
  };
  outcomeBasedLegs: OutcomeBasedLeg[];
  currency: string;
};

export type OutcomeBasedLeg = {
  eventId: Event;
  price: {
    fractional: FractionalOdds;
    decimal: number;
  };
};

export type Event = {
  id: string;
  supplier: string;
};

export type BetslipObbReport = {
  bets: BetslipObbReportBetMap;
};

export type BetslipObbReportBetMap = Record<string, BetslipObbReportBet>;

export type BetslipObbReportBet = {
  betId: string;
  receiptId: string;
  price: {
    fractional: FractionalOdds;
    decimal: number;
  };
  potentialPayout: number;
  stake: number;
  legs: Array<BetslipObbReportBetLeg>;
  betType: string;
  currency: string;
  stakePerLine: number;
  numberOfBaseBets: number;
  selectionsToWin?: number;
};

export type BetslipObbReportBetLeg = {
  price: {
    fractional: FractionalOdds;
    decimal: number;
  };
  metadata: ObbLegMetadata;
  event: ObbEvent;
  legId: string;
};

export type ImplyBetsMapper = {
  failures: FailuresMap;
  potentialBets: ObbPotentialBetMap;
  legs: ObbLegMap;
};

export type BetslipObbImplyBetsResponse = {
  betDefinitions: BetDefinitionResult[];
  combinedBetDefinitions: CombinedBetDefinitionResult[];
  result: ObbResult;
};

export type BetslipObbQuotes = Array<ObbQuote>;

export type BetslipSportsbookPlaceBetResult = {
  runnerMetadata: SportsbookReportRunnerMetadata;
  odds: SportsbookOdds | null;
  totalStake: number;
  totalPotentialWin: number | null;
};

export type OrderEdit = {
  price?: number | null;
  size?: number | null;
  persistenceType?: ExchangePersistenceType;
  validations: {
    price?: PriceLadderValidation;
    size?: SizeLadderValidation;
  };
};

export type BetslipExchangeEdit = {
  betId: string;
  isPersistenceTypeMenuExpanded: boolean;
  order?: OrderEdit;
};

export type BetslipExchangeContext = {
  runner: URN;
  side: ExchangeSide;
  market: URN;
  marketDepth: number;
};

export type BetslipCastContext = {
  [castId: string]: string;
};

export type OddsMovementDirection = "UP" | "DOWN";

export type OddsMovementValues = {
  id: string;
  value: number | null;
  movement?: OddsMovementDirection;
};

export type OddsMovementState = {
  [id: string]: OddsMovementValues;
};

export type HandicapMovementValues = {
  id: string;
  value: number;
  hasHandicapChanged: boolean;
};

export type HandicapMovementState = {
  [id: string]: HandicapMovementValues;
};

export type TaggingMetadataSelection = {
  urn: string;
  uniqueId: string;
};

export type TaggingMetadataSelections = {
  [urn: string]: TaggingMetadataSelection;
};

export type TaggingMetadataState = {
  selections: TaggingMetadataSelections;
};

export type ObbTaggingMetadata = {
  [legId: string]: ObbLegTaggingMetadata;
};

export type ObbModuleMetadata = {
  tabName?: string;
  group?: string;
  layout?: string;
  card?: string;
};

export type ObbLegTaggingMetadata = {
  eventId: string;
  competitionId: string;
  competition: string;
  sportId: string;
  sport: string;
  uniqueId: string;
} & ObbModuleMetadata;

export type RequestStatus = "NONE" | "INPROGRESS" | "SUCCESS" | "FAILURE";

export type IgnoredBet = { id: string; hasStake: boolean; shouldShowNotification: boolean };
export type IgnoredBets = IgnoredBet[];

export type BetslipSportsbookConfirmationBet = {
  combinations: BettingState.CombinationsMap;
  ignoredBets?: IgnoredBets;
  failures: BettingState.ImplyRunnerFailuresMap;
  legs: BettingState.LegsMap;
  availabilityChanged: boolean;
  runners: BettingState.RunnersMap;
  castContext?: BetslipCastContext;
};

export type BetslipState = {
  activeProduct: ActiveProduct;
  isCollapsed: boolean;
  isBetBuilderMultisNotificationVisible: boolean;
  isFreeBetsSelected: boolean;
  hasSportsbookTechnicalError: boolean;
  step: BetslipStep;
  group: BettingGroup;
  placeStatus: RequestStatus;
  updateStatus?: RequestStatus;
  cancelStatus?: RequestStatus;
  exchangeEdit?: BetslipExchangeEdit;
  exchangeReport?: BetslipExchangeReport;
  exchangePlaceError?: ExchangeBetTransactionError;
  exchangeCancelError?: ExchangeBetTransactionError;
  exchangeContext?: BetslipExchangeContext;
  sportsbookReport?: BetslipSportsbookReport;
  obbReport?: BetslipObbReport;
  sportsbookMultipleContext?: string;
  sportsbookCastContext?: BetslipCastContext;
  sportsbookOddsMovement: OddsMovementState;
  obbOddsMovement: OddsMovementState;
  sportsbookHandicapMovement: HandicapMovementState;
  sportsbookConfirmation?: BetslipSportsbookConfirmationBet;
  taggingMetadata: TaggingMetadataState;
  obbTaggingMetadata: ObbTaggingMetadata;
  isDepositRedirect: boolean;
  showMaxPayoutNotification: boolean;
  hasUserChangedOddsMovementPreference: boolean;
  selectedCombinationId?: string;
  isGenerosityActive?: boolean;
  hasGenerosityWallets?: boolean;
  hasGenerosityTokens?: boolean;
  keepOpenOnNavigation?: boolean;
  lastSuccessfulStake?: number;
};

export type ModalBetslipProps = {
  quickBetslipBet: QuickBetslipBet | null;
  hasMultiples: boolean;
  hasConfirmation: boolean;
  step: BetslipStep;
  activeProduct: ActiveProduct;
  isCollapsed: boolean;
  isClosed: boolean;
  activeBetslipType: BetslipType | null;
  dispatchHeaderToggle: (isCollapsed: boolean, betslipSubType: BetslipSubType) => void;
  dispatchDismissClick: () => void;
};

export type DesktopBetslipProps = {
  activeBetslipType: BetslipType | null;
  step: BetslipStep;
  hasConfirmation: boolean;
  onClose?: () => void;
};

export type StakeChangePayload = {
  id: string;
  newValue?: number;
};

export type SelectionRemovePayload = {
  legId: string;
  runnerUrn: string;
};

export type BlurPayload = {
  id: string;
};

export type Region = "AU" | "UK" | "US" | "AGNOSTIC";

export type CastBetRunnerSelectionProps = {
  id?: string;
  horse: string;
  racingSport?: RacingSport;
  icon?: string;
  meetingCountry?: Region;
  trap?: string | number;
  silkFallbackType?: FallbackIconType;
  position?: number;
  positionOrdinal?: string;
};

export type QuickBetslipFallbackReason = "non_football" | "invalid_combination";

export type QuickBetslipBet =
  | { status: "valid"; combinationId: string }
  | { status: "fallback"; reason: QuickBetslipFallbackReason };
