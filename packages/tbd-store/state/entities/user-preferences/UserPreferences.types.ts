import URN from "../../layout/URN";

export enum OddsDisplayPreference {
  American = "AMERICAN",
  Fractional = "FRACTIONAL",
  Decimal = "DECIMAL",
}

export type QuickStake = {
  stake: number;
};

export enum ProductsOption {
  sportsbook = "sportsbook",
  exchange = "exchange",
  games = "games",
}

// note: evaluate the change of using the same enum for "Product" (i.e. deprecate "ProductsOption" im favour of "Products")

export enum Product {
  Sportsbook = "Sportsbook",
  Exchange = "Exchange",
}

export enum ExchangeDefaultProductOption {
  ems = "ems",
  neme = "neme",
  default = "unassigned",
}

export enum DefaultProductOption {
  lastViewed = "last_viewed",
  sportsbook = "sportsbook",
  exchange = "exchange",
}

export type DefaultProductPreference = {
  typename: "DefaultProductPreference";
  urn: URN;
  defaultProductOptions: DefaultProductOption[];
  selectedDefaultProduct: DefaultProductOption;
};

export enum LastViewedProductOption {
  sportsbook = "sportsbook",
  exchange = "exchange",
}

export type LastViewedProductPreference = {
  typename: "LastViewedProductPreference";
  urn: URN;
  lastViewedProductOptions: LastViewedProductOption[];
  selectedLastViewedProduct: LastViewedProductOption;
};

export enum ExchangeDefaultModeOption {
  default = "DEFAULT",
  predicts = "PREDICTS",
}

export type ExchangeDefaultModePreference = {
  typename: "DefaultProductPreference";
  urn: URN;
  exchangeDefaultModeOptions: ExchangeDefaultModeOption[];
  selectedExchangeDefaultMode: DefaultProductOption;
};

export type UserPreferences = {
  confirmCashout: boolean;
  exchangeConfirmBetPlacement: boolean;
  exchangeOddsDisplay: OddsDisplayPreference;
  favoriteSports: number[];
  oddsMovement: boolean;
  products: ProductsOption[];
  exchangeDefaultProduct: ExchangeDefaultProductOption;
  defaultProduct: DefaultProductOption;
  lastViewedProduct: LastViewedProductOption;
  quickStakes: QuickStake[];
  showBalances: boolean;
  sportsbookOddsDisplay: OddsDisplayPreference;
  isMarketDepthActive?: boolean;
  isTimeFormCardCollapsed?: boolean;
  isEmbeddedCardCollapsed?: boolean;
  productSwitcherPreference?: ProductsOption.exchange | ProductsOption.sportsbook;
  phoenixMigratedUser: boolean;
  exchangeDefaultMode: ExchangeDefaultModeOption;
};

export type SingleChoicePreferences = Partial<
  Pick<UserPreferences, "confirmCashout" | "defaultProduct" | "exchangeDefaultProduct" | "sportsbookOddsDisplay">
> & {
  oddsMovement?: string;
};
export type UserPreferencesState = Partial<UserPreferences>;

export enum OddsMovementOptions {
  On = "ON",
  Off = "OFF",
}
export const ODDS_MOVEMENT_MAP = {
  [OddsMovementOptions.On]: true,
  [OddsMovementOptions.Off]: false,
};
