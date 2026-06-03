/* eslint-disable camelcase */
import { CountryCode, OddsDisplayPreference } from "../../state/entities";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import { PlatformType, TaggingCategory } from "./AnalyticsConstants";
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
  product: ProductType;
  vertical?: VerticalType;
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
export type BrandType = "bf";
export type ProductType = "mobile web" | "native app";
export type VerticalType = "rebuild" | "rebuild ecommerce";
export type ThemeType = "dark" | "light";
export type ProductOptionType = "rebuild_sportsbook" | "rebuild_exchange" | "rebuild_ecommerce" | "rebuild_gaming";

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
