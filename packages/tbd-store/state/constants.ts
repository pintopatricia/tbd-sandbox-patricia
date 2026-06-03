import { BET_TYPES } from "@ppb/betslip-core";
import type { Jurisdiction as JurisdictionType } from "../config/Jurisdiction";
import { ExchangeSide as ExchangeSideEnum } from "../clients/catalogue/catalogue-response-types";

export const Jurisdiction: Record<JurisdictionType, JurisdictionType> = {
  BRAZIL: "BRAZIL",
  DENMARK: "DENMARK",
  INTERNATIONAL: "INTERNATIONAL",
  ITALY: "ITALY",
  ROMANIA: "ROMANIA",
  SPAIN: "SPAIN",
};

export const ExchangeSide: Record<Uppercase<ExchangeSideEnum>, ExchangeSideEnum> = {
  BACK: ExchangeSideEnum.Back,
  LAY: ExchangeSideEnum.Lay,
};

export const BET_ENGINE_SIDE_MAPPER: Record<"Back" | "Lay", ExchangeSideEnum> = {
  Back: ExchangeSideEnum.Back,
  Lay: ExchangeSideEnum.Lay,
};

export enum CardGroupLayout {
  CARD_LIST = "CARD_LIST",
  COUPON = "COUPON",
  GRID_TWO_COLUMNS = "GRID_TWO_COLUMNS",
  GRID_FOUR_COLUMNS = "GRID_FOUR_COLUMNS",
}

export enum GamingCardGroupType {
  DEFAULT = "DEFAULT",
  RECENTLY_PLAYED = "RECENTLY_PLAYED",
  CATEGORIES = "CATEGORIES",
  FAVOURITE_GAMES = "FAVOURITE_GAMES",
}

export enum BenefitsPackageCriteriaType {
  SUM_EXCH_SBK = "SUM_EXCH_SBK",
  EXCH_MARKETS = "EXCH_MARKETS",
}

export enum SelectableItemsFilterOptions {
  UK_AND_IRE = "UkAndIre",
  ALL_COUNTRIES = "AllCountries",
}

export enum ForbiddenContentType {
  GENERIC = "GENERIC",
  MARKET_GRAPHS = "MARKET_GRAPHS",
  MY_BETS = "MY_BETS",
}

export enum ImsPromotionErrorCodes {
  Completed = "COMPLETED",
  NotEligible = "NOT_ELIGIBLE",
  General = "GENERAL",
}
export enum CardIconTypes {
  Cup = "CUP",
  Specials = "SPECIALS",
  Outrights = "OUTRIGHTS",
  Bingo = "BINGO",
  Casino = "CASINO",
  Blackjack = "BLACKJACK",
  Tournaments = "TOURNAMENTS",
  TableGames = "TABLEGAMES",
  Exclusive = "EXCLUSIVE",
  CardTable = "CARDTABLE",
  Games = "GAMES",
  InstantWins = "INSTANTWINS",
  Jackpots = "JACKPOTS",
  Live = "LIVECASINO",
  New = "NEW",
  Roulette = "ROULETTE",
  Slots = "SLOTS",
  Slingo = "SLINGO",
  Promotions = "PROMOTIONS",
  CrashGames = "CRASHGAMES",
  Favourites = "FAVOURITES",
}

export enum VirtualSport {
  HorsesFlat = 0,
  HorsesJumps = 100,
  HorsesSprint = 10,
  Greyhounds = 1,
  MotorRacing = 3,
  ClubFootball = 4,
  WorldCup = 9,
}

export enum WalletNames {
  MAIN = "MAIN",
  ITA = "ITA",
  SPORTSBOOK_BONUS = "SPORTSBOOK_BONUS",
  SPORTSBOOK_BONUS_CASH = "SPORTSBOOK_BONUS_CASH",
  SPORTSBOOK_BONUS_WAGERING = "SPORTSBOOK_BONUS_WAGERING",
  EXCHANGE_BONUS_CASH = "EXCHANGE_BONUS_CASH",
  BOOST_TOKENS = "BOOST_TOKENS",
  ACCA_INSURANCE_TOKENS = "ACCA_INSURANCE_TOKENS",
  MONEY_BACK_TOKENS = "MONEY_BACK_TOKENS",
}

export enum WalletStatus {
  SUCCESS = "SUCCESS",
  DOWNSTREAM_ERROR = "DOWNSTREAM_ERROR",
}

export enum RaceRunnerStatus {
  RUNNER = "RUNNER",
  NON_RUNNER = "NON_RUNNER",
  WITHDRAWN = "WITHDRAWN",
  RESERVE = "RESERVE",
  DROPPED_OUT_AT_FIVE_DAY = "DROPPED_OUT_AT_FIVE_DAY",
  DROPPED_OUT_AT_FOUR_DAY = "DROPPED_OUT_AT_FOUR_DAY",
  DROPPED_OUT_AT_OVERNIGHT = "DROPPED_OUT_AT_OVERNIGHT",
  DROPPED_OUT_DURING_EARLY_CLOSERS = "DROPPED_OUT_DURING_EARLY_CLOSERS",
  RACE_ABANDONED = "RACE_ABANDONED",
  MAIN_TRACK_ONLY = "MAIN_TRACK_ONLY",
  ALSO_ELIGIBLE = "ALSO_ELIGIBLE",
}

export enum MessageCode {
  INVALID_LEGS_AMOUNT = 1,
  CANCEL_UNMATCHED_BET_SUCCESS,
  CANCEL_ALL_UNMATCHED_BETS_SUCCESS,
  NOTIFICATIONS_SUBSCRIBED_SUCCESS,
  BET_INFO,
  COPY_ID_INFO,
  INVALID_SESSION,
  REALITY_CHECK_ALERT,
  CLICK_INACTIVE_SBK_BUTTON,
  BELL_EVENT_NOTIFICATION,
  NOTIFICATIONS_UNSUBSCRIBED,
  CLICK_INACTIVE_SBK_BUTTON_VIRTUALS,
  CASHOUT_FAILURE,
  FAVOURITE_MARKETS_LIMIT_REACHED,
  LIVE_ACTIVITY_SUBSCRIBED_SUCCESS,
  LIVE_ACTIVITY_UNSUBSCRIBED_SUCCESS,
}

export enum MessageType {
  Success = "SUCCESS",
  Warning = "WARNING",
  Error = "ERROR",
  Info = "INFO",
}

export enum LOYALTY_MESSAGES_TYPE {
  TOAST = "TOAST",
  FULL_SCREEN = "FULL_SCREEN",
}

export enum RacingSport {
  HORSE_RACING = 7,
  GREYHOUND_RACING = 4339,
}

export enum SportsbookMarketStatus {
  OPEN = "OPEN",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export enum SportsbookRunnerStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REMOVED = "REMOVED",
}

export enum BetslipType {
  SPORTSBOOK = "SPORTSBOOK",
  OBB = "OBB",
}

export enum BetType {
  SGL = BET_TYPES.SINGLE,
  DBL = BET_TYPES.DOUBLE,
  TBL = BET_TYPES.TREBLE,
  ACC4 = BET_TYPES.FOURFOLD,
  ACC5 = BET_TYPES.FIVEFOLD,
  ACC6 = BET_TYPES.SIXFOLD,
  ACC7 = BET_TYPES.SEVENFOLD,
  ACC8 = BET_TYPES.EIGHTFOLD,
  ACC9 = BET_TYPES.NINEFOLD,
  AC10 = BET_TYPES.TENFOLD,
  AC11 = BET_TYPES.ELEVENFOLD,
  AC12 = BET_TYPES.TWELVEFOLD,
  AC13 = BET_TYPES.THIRTEENFOLD,
  AC14 = BET_TYPES.FOURTEENFOLD,
  AC15 = BET_TYPES.FIFTEENFOLD,
  AC16 = BET_TYPES.SIXTEENFOLD,
  AC17 = BET_TYPES.SEVENTEENFOLD,
  AC18 = BET_TYPES.EIGHTEENFOLD,
  AC19 = BET_TYPES.NINETEENFOLD,
  AC20 = BET_TYPES.TWENTYFOLD,
  AC21 = BET_TYPES.TWENTYONEFOLD,
  AC22 = BET_TYPES.TWENTYTWOFOLD,
  AC23 = BET_TYPES.TWENTYTHREEFOLD,
  AC24 = BET_TYPES.TWENTYFOURFOLD,
  AC25 = BET_TYPES.TWENTYFIVEFOLD,
  TRX = BET_TYPES.TRIXIE,
  PAT = BET_TYPES.PATENT,
  YAN = BET_TYPES.YANKEE,
  CAN = BET_TYPES.CANADIAN,
  HNZ = BET_TYPES.HEINZ,
  SHNZ = BET_TYPES.SUPER_HEINZ,
  GOL = BET_TYPES.GOLIATH,
  L15 = BET_TYPES.LUCKY_15,
  L31 = BET_TYPES.LUCKY_31,
  L63 = BET_TYPES.LUCKY_63,
}

export enum LegType {
  SS = "SIMPLE_SELECTION", // Simple selection
  SF = "FORECAST", // Straight Forecast
  RF = "REVERSE_FORECAST", // Reverse Forecast,
  CF = "COMBINATION_FORECAST", // Combination forecast,
  TC = "TRICAST", // Straight Tricast,
  CT = "COMBINATION_TRICAST", // Combination Tricast,
  SC = "SCORECAST", // Scorecast,
  MH = "MH", // Western Handicap with Line
  WH = "WH", // Western (straight) Handicap
  SL = "SL", // Higher/Lower Split Line
  HL = "HL", // Higher/Lower
  FW = "FW", // First goalscorer wincast
  LW = "LW", // Last goalscorer wincast
  AW = "AW", // Anytime goalscorer wincast
  OB = "OB", // Outcome Based
}

/**
 * Runner status enum
 * A Exchange Runner may have one of three status: ACTIVE, SUSPENDED and REMOVED
 */
export enum ExchangeRunnerStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REMOVED = "REMOVED",
}

export enum PYWEventStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
}

export enum PYWEventActions {
  BALANCE_REFRESHED = "BALANCE_REFRESHED",
  CANCEL_DEPOSIT = "CANCEL_DEPOSIT",
  DEPOSIT_FAILED = "DEPOSIT_FAILED",
  DEPOSIT_SUCCESS = "DEPOSIT_SUCCESS",
  PAGE_LOAD = "PAGE_LOAD",
  RESIZE = "RESIZE",
  USER_CAN_DEPOSIT = "USER_CAN_DEPOSIT",
}

export enum FixtureStatus {
  PRE_MATCH = "PRE_MATCH",
  IN_PLAY = "IN_PLAY",
  END = "END",
  UNKNOWN = "UNKNOWN",
}

export enum ScoreStyle {
  FINISHED = "FINISHED",
  EMPTY = "EMPTY",
  IN_PLAY = "IN_PLAY",
  DEFAULT = "DEFAULT",
  PAUSED = "PAUSED",
}

export enum CashoutStep {
  HIDE = "HIDE",
  DISPLAY = "DISPLAY",
  CONFIRM = "CONFIRM",
  CASHING_OUT = "CASHING_OUT",
  RECEIPT = "RECEIPT",
}

export enum FootballMatchStatus {
  PRE_MATCH = "PRE_MATCH",
  HALF = "HALF",
  FULL = "FULL",
  INPLAY_FIRST_HALF = "INPLAY_FIRST_HALF",
  INPLAY_SECOND_HALF = "INPLAY_SECOND_HALF",
  PENALTY_SHOOTOUT = "PENALTY_SHOOTOUT",
  END = "END",
}

export enum FootballMatchPeriod {
  EXTRA = "EXTRA",
  REGULAR = "REGULAR",
}

export enum ScaFixtureOutcome {
  DRAW = "DRAW",
  LOSE = "LOSE",
  WIN = "WIN",
}

export enum Outcome {
  corners = "corners",
  goals = "goals",
  totalCards = "totalCards",
  shotsOnTarget = "shotsOnTarget",
  totalShots = "totalShots",
  fouls = "fouls",
  foulsWon = "foulsWon",
  passes = "passes",
  assists = "assists",
}

export enum Comparison {
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  EQUAL = "EQUAL",
}

export enum Result {
  CASHED_OUT = "CASHED_OUT",
  FROZEN = "FROZEN",
  LOST = "LOST",
  PLACED = "PLACED",
  SETTLED = "SETTLED",
  VOID = "VOID",
  WON = "WON",
  WINNING = "WINNING",
  LOSING = "LOSING",
}

export enum ResultType {
  CONFIRMED = "CONFIRMED",
  POTENTIAL = "POTENTIAL",
  UNKNOWN = "UNKNOWN",
}

export enum OutcomeDefinitionOperator {
  AND = "AND",
  OR = "OR",
}

export enum OutcomeDefinitionType {
  OPERATOR = "OPERATOR",
  OPERAND = "OPERAND",
}

export enum ExchangeMarketStatus {
  Open = "OPEN",
  Closed = "CLOSED",
  Suspended = "SUSPENDED",
}

export enum RouletteNumberColor {
  GREEN = "GREEN",
  RED = "RED",
  BLACK = "BLACK",
}

export enum ParticipantSide {
  HOME = "home",
  AWAY = "away",
  BOTH = "both",
}

export enum ParticipantType {
  TEAM = "TEAM",
  PLAYER = "PLAYER",
}

export enum BetResponse {
  UNMATCHED = "unmatched",
  MATCHED = "matched",
  PARTIALLY_MATCHED = "partially-matched",
  SP = "sp",
}

export enum Alignment {
  Left = "left",
  Right = "right",
  Center = "center",
}

export enum FacetType {
  EVENT = "EVENT",
  RACE = "RACE",
}

/**
 * This is a list of sportIds.
 * It has been used to identify the Sports allowed to use the ONE_LINE_BET legType.
 */
export enum EventType {
  FOOTBALL = 1,
  LOTTERIES = 29125756,
}

export enum RaceType {
  FLAT = "FLAT",
  HURDLE = "HURDLE",
  CHASE = "CHASE",
  BUMPER = "BUMPER",
}

export enum Going {
  ALL_WEATHER = "ALL_WEATHER",
  DEAD = "DEAD",
  EASY = "EASY",
  FAST = "FAST",
  FIRM = "FIRM",
  FROZEN = "FROZEN",
  GOOD = "GOOD",
  GOOD_FIRM = "GOOD_FIRM",
  GOOD_SOFT = "GOOD_SOFT",
  GOOD_YIELDING = "GOOD_YIELDING",
  HARD = "HARD",
  HEAVY = "HEAVY",
  MUDDY = "MUDDY",
  NORMAL = "NORMAL",
  RAIN = "RAIN",
  SAND = "SAND",
  SLOPPY = "SLOPPY",
  SLOW = "SLOW",
  SOFT = "SOFT",
  SOFT_HEAVY = "SOFT_HEAVY",
  STANDARD = "STANDARD",
  STD = "STD",
  STD_FAST = "STD_FAST",
  STD_SLOW = "STD_SLOW",
  SYNTHETIC = "SYNTHETIC",
  VERY_SOFT = "VERY_SOFT",
  WET_FAST = "WET_FAST",
  YIELDING = "YIELDING",
  YIELDING_SOFT = "YIELDING_SOFT",
}

export enum RaceStatus {
  ABANDONED = "ABANDONED",
  AT_THE_POST = "AT_THE_POST",
  DELAYED = "DELAYED",
  DORMANT = "DORMANT",
  FALSE_START = "FALSE_START",
  FINISHED = "FINISHED",
  GOING_BEHIND = "GOING_BEHIND",
  GOING_DOWN = "GOING_DOWN",
  OFF = "OFF",
  PARADING = "PARADING",
  PHOTOGRAPH = "PHOTOGRAPH",
  RACE_VOID = "RACE_VOID",
  RESULT = "RESULT",
  UNDER_ORDERS = "UNDER_ORDERS",
  WEIGHED_IN = "WEIGHED_IN",
}

export enum HorseSex {
  COLT = "COLT",
  FILLY = "FILLY",
  GELDING = "GELDING",
  HORSE = "HORSE",
  MARE = "MARE",
  RIG = "RIG",
  UNKNOWN = "UNKNOWN",
}

export enum HorseColor {
  BAY = "BAY",
  BAY_GREY = "BAY_GREY",
  BLACK = "BLACK",
  BLACK_BAY = "BLACK_BAY",
  BROWN = "BROWN",
  BROWN_BAY = "BROWN_BAY",
  BROWN_BLACK = "BROWN_BLACK",
  BROW_GREY = "BROW_GREY",
  CHESTNUT = "CHESTNUT",
  DARK_BAY = "DARK_BAY",
  DARK_BROWN = "DARK_BROWN",
  DARK_LIVER = "DARK_LIVER",
  DARK_CHESTNUT = "DARK_CHESTNUT",
  GREY = "GREY",
  GREY_BAY = "GREY_BAY",
  GREY_BROWN = "GREY_BROWN",
  GREY_CHESTNUT = "GREY_CHESTNUT",
  GREY_BLACK = "GREY_BLACK",
  GREY_ROAN = "GREY_ROAN",
  LIGHT_BAY = "LIGHT_BAY",
  LIGHT_CHESTNUT = "LIGHT_CHESTNUT",
  PALOMINO = "PALOMINO",
  ROAN = "ROAN",
  SKEWBALD = "SKEWBALD",
  WHITE = "WHITE",
  UNKNOWN = "UNKNOWN",
}

export enum FallbackIconType {
  HorseRacing = "HORSE_RACING",
}

export enum Label {
  NEW = "NEW",
  JACKPOT = "JACKPOT",
  EXCLUSIVE = "EXCLUSIVE",
  PREMIER = "PREMIER",
  RECOMMENDED = "RECOMMENDED",
  UPGRADED = "UPGRADED",
  FEATURED = "FEATURED",
  PLAY_IT_HERE_FIRST = "PLAY IT HERE FIRST",
}

export enum JackpotLogo {
  DAILY_JACKPOT = "Daily Jackpot",
  DAILY_JACKPOT_GLOW = "Daily Jackpot Glow",
  GAMES_NEW_DAILY_JACKPOT = "Games New Daily Jackpot",
  MACAU_DAILY_JACKPOT = "Macau Daily Jackpot",
  MUST_GO_JACKPOT = "Must Go Jackpot",
  JACKPOT_KING = "Jackpot King",
  PROGRESSIVE_JACKPOT = "Progressive Jackpot",
  PUB_FRUIT = "Pub Fruit",
  NONE = "None",
}

export enum LiveStreamBroadcastsOptions {
  DataViz = "data viz",
  LiveVideo = "live video",
}

export enum GameCardTileSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum ObbLegTemplateIds {
  PLAYER_VS_PLAYER = "playerVsPlayer",
  X_OF_N = "xOfN",
  PARTICIPANTS_COMBINED = "participantsCombined",
  SQUAD_VS_SQUAD = "squadVsSquad",
}
