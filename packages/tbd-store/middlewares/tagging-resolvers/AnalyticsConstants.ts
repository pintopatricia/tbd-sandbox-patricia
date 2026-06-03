// Due to a limitation from android firebase. See ticket TX2-226
export const MAX_URL_LENGTH_FOR_TAGGING = 500;

export enum BetDirection {
  Back = "back",
  Lay = "lay",
}

export enum BetTypeGroup {
  Single = "single",
  Multiple = "multiple",
}

export enum YesNo {
  Yes = "yes",
  No = "no",
}

export enum CashoutType {
  Full = "full",
  Partial = "partial",
}

export enum PlatformType {
  Web = "web",
  Native = "native",
  Wrapper = "wrapper",
}

export enum TaggingCategory {
  EXC_BETTING = "exchange betting",
  SBK_BETTING = "betting",
  INTERFACE = "interface",
  NAVIGATION = "navigation",
  MEDIA = "media",
  MY_ACCOUNT = "my account",
  GAMING = "gaming",
  BANNER = "banner",
  TEXT_MEDIA = "text media",
  CASHOUT = "cashout",
  PROMOTIONS = "promotions",
  ERROR_MESSAGES = "error messages",
  LOOP = "loop",
  CHANNEL_PERFORMANCE = "channel performance",
  DEEPLINK = "deeplink",
}

export enum TaggingAction {
  ACCEPT_PROMOTION = "clicked to opt in",
  ADD_PREVIOUS_SELECTIONS = "add previous selections",
  ADDED = "added",
  ADDED_SELECTION = "added selection",
  ATTEMPTED_CASHOUT = "attempted cashout",
  AUTO_CONFIRMED_BET = "auto confirmed bet",
  AUTO_CONFIRMED_CASHOUT = "auto confirmed cashout",
  CANCEL_BET = "cancel bet",
  CANCELLED = "cancelled",
  CANCELLED_ALL_BETS_FAILURE = "cancelled all unmatched bets - error",
  CANCELLED_ALL_BETS_SUCCESS = "cancelled all unmatched bets - success",
  CANCELLED_BET = "cancelled unmatched bet",
  CANCELLED_BET_FAILURE = "cancelled unmatched bet - error",
  CANCELLED_BET_SUCCESS = "cancelled unmatched bet - success",
  CHANGED_ODDS = "changed odds",
  CLEARED = "cleared",
  CLICK = "click",
  CLICKED = "clicked",
  CLICKED_BANNER = "clicked banner",
  CLICKED_BANNER_CTA = "clicked banner cta",
  CLICKED_BANNER_TERMS_AND_CONDITIONS = "clicked banner t&cs",
  CLICKED_PLAY_NOW = "clicked play now",
  CLOSED = "closed",
  COLLAPSE = "collapse",
  CONFIRMED_BET = "confirmed bet",
  CONFIRMED_CASHOUT = "confirmed cashout",
  COPIED = "copied",
  DESELECTED = "deselected",
  DISPLAYED = "displayed",
  DONT_UPDATE = "don't update",
  EDIT_UNMATCHED_BET = "edit unmatched bet",
  EDITED_BET = "edited bet",
  EXPAND = "expand",
  FAILED_CASHOUT = "failed cashout",
  HIDE = "hide",
  LOGIN_TO_PLACE_BET = "login to place bet",
  MOVED = "moved",
  NAVIGATED_TO = "navigated to",
  OPENED = "opened",
  PLACED_BET = "placed bet",
  PLACED_BET_ERROR = "placed bet - error",
  RECEIVED_MESSAGE = "received",
  REMOVED = "removed",
  REMOVED_ALL_SELECTIONS = "removed all selections",
  REMOVED_SELECTION = "removed selection",
  REPOSITIONED = "repositioned",
  RESOURCE_NOT_FOUND = "404",
  SAW = "saw",
  SAW_MESSAGE = "saw message",
  SAW_VIDEO = "saw video",
  SELECTED = "selected",
  SHOW = "show",
  SUBMITTED_BET = "submitted bet",
  SUBMITTED_UPDATE_UNMATCHED_BET = "submitted update unmatched bet",
  SUCCEEDED_CASHOUT = "succeeded cashout",
  SWIPED_LEFT = "swiped left",
  SWIPED_RIGHT = "swiped right",
  SWITCH_PRODUCT = "switch product",
  SWITCHED_VIEW = "switched view to",
  TOGGLE_OFF = "toggled off",
  TOGGLE_ON = "toggled on",
  UNSELECTED = "unselected",
  UPDATE_BET_FAILURE = "updated unmatched bet - error",
}

export enum GameType {
  DEMO_PLAY = "demo play",
  REAL_PLAY = "real play",
}

export enum MarketFlags {
  SUPER_SUB = "safesub",
}

export enum NavigationTabsTitle {
  FAVOURITE_MARKETS = "favourite",
}
