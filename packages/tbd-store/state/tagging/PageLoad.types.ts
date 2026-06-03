/* eslint-disable camelcase */
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import { PlatformType } from "./AnalyticsConstants";
import { CountryCode } from "../entities/user-details/UserDetailsState";
import { OddsDisplayPreference } from "../entities/user-preferences/UserPreferences.types";
import { TaggingCategory } from "../../middlewares/tagging-resolvers/AnalyticsConstants";
import { TaggingEventType } from "./Event.types";

export type MarketingDimensions = {
  rfr: string | null;
  pid: string | null;
  ttp: string | null;
  bid: string | null;
  promo_code: string | null;
  TrackingTags: string | null;
};

export type UserDimensions = {
  acc_id: number | null;
  country: CountryCode;
  jurisdiction: string | null;
  locale: string;
  login_status: string | null;
  odds_display: OddsDisplayPreference;
  reg_status: RegistrationStatusType;
  locale_language: string;
  account_balance: number | null;
  [BUSINESS.CURRENCY_CODE]: string;
};

export type ProductDimensions = {
  brand: BrandType;
  product: PlatformType;
  vertical?: ProductOptionType;
  theme: ThemeType;
  [BUSINESS.DATA_BRIDGE_PROJECT]: ProductOptionType;
  [BUSINESS.DATA_BRIDGE_PLATFORM]: string;
  [BUSINESS.VERTICAL]?: VerticalType; // Same value of vertical to be used on native app.
};

export type EnvironmentDimensions = {
  ga_target_property?: string;
  app_id: string;
};

export type PageDimensions = {
  sport_id: number | null;
  sport_name: string | null;
};

export type TestDimensions = {
  bucket_id: number | null;
};

export type RegistrationStatusType = "returning registered" | "new prospect" | "returning prospect" | "unregistered";
export type BrandType = "bf" | "sbg";
export type ProductType = "mobile web" | "native app";
export type VerticalType = "rebuild" | "rebuild ecommerce";
export type ThemeType = "dark" | "light";
export type ProductOptionType =
  | "rebuild_sportsbook"
  | "rebuild_exchange"
  | "rebuild_ecommerce"
  | "rebuild_gaming"
  | "rebuild_bet"
  | "cactus_sportsbook"
  | "cactus_exchange"
  | "cactus_ecommerce"
  | "cactus_gaming"
  | "cactus_bet";
export type ProductOptionPrefixType = "rebuild" | "cactus";
export type GtmDimensionsType = { brand: BrandType; prefix: ProductOptionPrefixType };

export type GlobalDimensions = {
  [APPLICATION.ACCOUNT_ID]: number | null;
  [BUSINESS.VERTICAL]?: VerticalType;
  [APPLICATION.LOGIN_STATUS]: string | null;
  [APPLICATION.ID]: string;
  [BUSINESS.ODDS_DISPLAY]: OddsDisplayPreference;
  [APPLICATION.LOCALE]: string;
  [APPLICATION.JURISDICTION]: string | null;
  [APPLICATION.COUNTRY]: CountryCode;
  [APPLICATION.BRAND]: BrandType;
  [BUSINESS.DATA_BRIDGE_PROJECT]: ProductOptionType;
  [BUSINESS.DATA_BRIDGE_PLATFORM]: PlatformType;
  [BUSINESS.CURRENCY_CODE]: string;
};

export type PageLoadEvent = {
  event: TaggingEventType;
} & EnvironmentDimensions &
  ProductDimensions &
  TestDimensions &
  MarketingDimensions &
  PageDimensions &
  UserDimensions;

export type ExperimentLoadEvent = {
  event: TaggingEventType;
  category: TaggingCategory;
  action: string;
  label: string;
  [APPLICATION.ACCOUNT_ID]: number;
  [BUSINESS.LOOP_BUCKET_ID]: number;
};

export type GA4MarketingDimensions = {
  rfr: string | null;
  pid: string | null;
  ttp: string | null;
  bid: string | null;
  promo_code: string | null;
  sid: string | null;
  efid: string | null;
  clkid: string | null;
  aff_id: string | null;
  btag: string | null;
  sub_id: string | null;
  pi: string | null;
  mi_u: string | null;
  mi_ign: string | null;
};

export type GA4UserDimensions = {
  account_id?: string;
  first_name: string;
  last_name: string;
  country: CountryCode;
  jurisdiction: string | null;
  locale: string;
  login_status: string | null;
  reg_status: RegistrationStatusType;
  language: string;
  account_balance: string | null;
  currency: string;
  user_id?: string | null;
  city?: string | null;
};

export type GA4ProductDimensions = {
  brand: BrandType;
  product: PlatformType;
  vertical?: ProductOptionType;
  product_theme: ThemeType;
  context: string;
};

export type GA4TestDimensions = {
  bucket_id: number | null;
};

export type GA4DeviceDimensions = {
  orientation: string;
  connection_type?: string;
};

export type MetaDataEvent = {
  event: TaggingEventType;
} & GA4ProductDimensions &
  GA4TestDimensions &
  GA4MarketingDimensions &
  GA4UserDimensions;
