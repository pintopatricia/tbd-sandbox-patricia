// REFERENCE: https://gitlab.app.betfair/pp-sportsbook-web/ppbf-sb-platform/blob/master/analytics/analytics-dimensions.js

export enum APPLICATION {
  ACCOUNT_ID = "cd1",

  MODULE = "cd3",

  ID = "cd54",

  LOGIN_STATUS = "cd20",

  LOCALE = "cd15",

  JURISDICTION = "cd27",

  COUNTRY = "cd49",

  BRAND = "cd105",
}

export enum DEVICE {
  POSITION = "cd67",
}

export enum BUSINESS {
  VERTICAL = "cd2",

  SPORT_NAME = "cd5",

  COMPETITION_NAME = "cd6",

  EVENT_NAME = "cd7",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  MEETING_NAME = "cd6",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  RACE_NAME = "cd7",

  MARKET_NAME = "cd8",

  ODDS_DISPLAY = "cd38",

  /**
   * The direction of the bet: back or lay.
   */
  BET_DIRECTION = "cd11",

  GAME_NAME = "cd12",

  GAME_STATE = "cd143",

  GAME_ID = "cd13",

  SPORT_ID = "cd14",

  BET_ID = "cd29",

  /**
   * The destination url of the bet - URL that a button brings you upon click.
   */
  DESTINATION_URL = "cd34",

  TRANS_IN_PLAY_INDICATOR = "cd42",

  TRANS_CASHOUT_INDICATOR = "cd43",

  GAME_PROVIDER = "cd74",

  /**
   * The sport event was in-play at the time this gtm event occurred.
   * It can be yes or no.
   */
  IN_PLAY_INDICATOR = "cd79",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  EVENT_ID = "cd84",

  /**
   * The URL of the page in which this gtm event occurred.
   */
  SELECTION_SOURCE_URL = "cd85",

  PROMOTION_ID = "cd81",

  PROMOTION_NAME = "cd87",

  /**
   * indicates if a customer has 'accepted' a promotion
   */
  PROMOTION_STATUS = "cd88",

  PROMOTION_USER_STATUS = "cd93",

  /**
   * The each way indicator.
   * It can be yes or no.
   */
  EACHWAY_INDICATOR = "cd91",

  ERROR_CODE = "cd99",

  MARKET_ID = "cd101",

  SELECTION_ID = "cd102",

  /**
   * The order of the gaming zone on the page relative to other zones.
   */
  ZONE_DISPLAY_ORDER = "cd103",

  PRICE_AT_SELECTION = "cd112",

  /**
   * The price after bet is placed
   */
  PRICE_AT_BET = "cd113",

  COMPETITION_ID = "cd129",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  RACE_ID = "cd84",

  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  MEETING_ID = "cd129",

  ANTEPOST_FLAG = "cd131",

  SELECTION_NAME = "cd132",

  /**
   * The currency code ( eur, gbp, etc )
   */
  CURRENCY_CODE = "cd16",

  /**
   * The place bet type ( matched, sp, unmatched, partially-matched )
   */
  BET_RESPONSE = "cd19",

  MODULE_OF_SELECTION = "cd51",

  CASHOUT_INDICATOR = "cd89",

  BET_RECEIPT = "cd9",

  /**
   * The bet type group: single, multiple
   */
  BET_TYPE_GROUP = "cd28",

  /**
   * The bet type: single, treble, lucky 15, etc
   */
  BET_TYPE = "cd10",

  CONFIRM_BETS_INDICATOR = "cd94",

  ACCEPT_ODDS_INDICATOR = "cd95",

  ACCA_EDGE_INDICATOR = "cd96",

  EW_EDGE_INDICATOR = "cd142",

  PRICE_BOOST_INDICATOR = "cd111",

  BEST_ODDS_GUARANTEED_INDICATOR = "cd55",

  CMS_CARD_TITLE = "cd133",

  CMS_CARD_DISPLAY_ORDER = "cd134",

  CMS_COUPON_NAME = "cd135",

  CMS_BADGE = "cd136",

  SEARCH_TEXT = "cd138",

  PERSONALIZED = "cd4",

  DECISION_MODEL_NAME = "cd68",

  DECISION_MODEL_VARIANT = "cd69",

  CASHOUT_TYPE = "cd70",

  PROVIDER_NAME = "cd122",

  STAKE_AMOUNT = "cm1",

  NUMBER_OF_SELECTIONS = "cm4",

  NUMBER_OF_LEGS = "cm5",

  CASHOUT_AMOUNT = "cm50",

  DATA_BRIDGE_PROJECT = "cd109",

  DATA_BRIDGE_PLATFORM = "cd110",

  CASHOUT_PROFIT_AMOUNT = "cm51",

  SELECTION_UNIQUE_ID = "cd130",

  LOOP_BUCKET_ID = "cd26",
}
