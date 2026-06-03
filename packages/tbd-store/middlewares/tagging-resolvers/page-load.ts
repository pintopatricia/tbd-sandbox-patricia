import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  EnvironmentDimensions,
  MarketingDimensions,
  PageDimensions,
  PageLoadEvent,
  ProductDimensions,
  RegistrationStatusType,
  TestDimensions,
  ThemeType,
  UserDimensions,
  ProductOptionType,
} from "../../state/tagging/PageLoad.types";
import { UserDetails, ProductsOption } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { BUSINESS } from "./AnalyticsDimensions";
import { PlatformType } from "./AnalyticsConstants";
import { getApplicationKey } from "../../config/application-key";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { createFindViewByURNSelector } from "../../state/layout/views/view-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../../state/entities/user-preferences/user-preferences-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { createGetUserMainWalletValueSelector } from "../../state/entities/user-wallets/user-wallets-selectors";
import { createSportsbookMarketByURNSelector } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { ProductTagging } from "../../helpers/tagging";

export type GetCookie = (cookieName: string) => Promise<string | null>;

const getViewByURN = createFindViewByURNSelector();
const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
const getExchangeMarketByURN = createExchangeMarketSelector();
const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

const getMarketingDimensions = async (getCookie: GetCookie): Promise<MarketingDimensions> => ({
  rfr: await getCookie("rfr"),
  pid: await getCookie("pid"),
  ttp: await getCookie("ttp"),
  bid: await getCookie("bid"),
  promo_code: await getCookie("promo_code"),
  TrackingTags: await getCookie("TrackingTags"),
});

/**
 * denotes the registration status of the user at time of page load. Values taken from bsfd cookie. Logic is
 * if bsfd cookie contains st=reg, pass 'returning registered' OR if bsfd cookie contains st=p, pass 'new prospect'
 * OR if bsfd cookie contains st=rp, pass 'returning
 * prospect' ELSE 'unregistered'
 */
const getRegistrationStatus = async (getCookie: GetCookie): Promise<RegistrationStatusType> => {
  const bfsd = await getCookie("bfsd");

  if (bfsd) {
    const bfsdValue = /st=(.*?)$/gm.exec(bfsd) || [];

    switch (bfsdValue[1]) {
      case "reg":
        return "returning registered";
      case "p":
        return "new prospect";
      case "st":
        return "returning prospect";
      default:
        return "unregistered";
    }
  }

  return "unregistered";
};

const getProductOption = (state: ApplicationState): ProductOptionType => {
  const prefix = `rebuild_`;

  const { currentView } = state.router;
  const { products } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
  const isSbkAvailable = products.includes(ProductsOption.sportsbook);

  switch (currentView) {
    case EntityType.MyAccountView:
      return `${prefix}ecommerce`;
    case EntityType.GamingView:
    case EntityType.GamingCategoryView:
    case EntityType.GamingSegmentationView:
    case EntityType.GamingExternalView:
      return `${prefix}gaming`;
    default:
      return `${prefix}${isSbkAvailable ? ProductTagging.Sportsbook : ProductTagging.Exchange}`;
  }
};

const getUserDimensions = async (state: ApplicationState, getCookie: GetCookie): Promise<UserDimensions> => {
  const { countryCode, currencyCode, localeCode, accountId, loggedIn, jurisdiction } = <UserDetails>(
    getUserDetails(state)
  );

  const regStatus = await getRegistrationStatus(getCookie);

  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const accountBalance = getUserMainWalletValue(state);

  const { sportsbookOddsDisplay: oddsDisplay } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
  const languageCookie = await getCookie("language");
  const localeLanguage = `${localeCode}-${languageCookie}`;

  return {
    acc_id: accountId,
    country: countryCode,
    jurisdiction: jurisdiction.jurisdiction,
    locale: localeCode,
    login_status: loggedIn ? "logged in" : "logged out",
    reg_status: regStatus,
    locale_language: localeLanguage,
    account_balance: accountBalance,
    odds_display: oddsDisplay,
    [BUSINESS.CURRENCY_CODE]: currencyCode,
  };
};

const getProductDimensions = (
  state: ApplicationState,
  platformType: PlatformType,
  theme: ThemeType,
): ProductDimensions => {
  const productOption = getProductOption(state);
  return {
    brand: "bf",
    product: platformType,
    vertical: productOption,
    theme,
    [BUSINESS.DATA_BRIDGE_PROJECT]: productOption,
    [BUSINESS.DATA_BRIDGE_PLATFORM]: platformType,
  };
};

const getEnvironmentDimensions = (platformType: PlatformType): EnvironmentDimensions =>
  // GA4 does not allow the "ga_target_property" since is reserved
  // GA4 target property is defined on both iOS and Android "GTM-XXXXXX.json" file in this project
  platformType === PlatformType.Native
    ? {
        app_id: getApplicationKey(),
      }
    : {
        ga_target_property: "UA-43334570-2",
        app_id: getApplicationKey(),
      };

const getTestDimensions = (state: ApplicationState): TestDimensions => {
  const { bucketId } = <UserDetails>getUserDetails(state);
  return {
    bucket_id: bucketId,
  };
};

const getPageDimensions = (state: ApplicationState): PageDimensions => {
  const { router } = state;
  const { sports } = state.entities;
  let sportURN: string | undefined;

  // No route
  if (!router.currentUrn) {
    return {
      sport_id: null,
      sport_name: null,
    };
  }

  const view = getViewByURN(state.layouts.views, router.currentUrn);

  // Retrieve sportUrn depending on the view
  switch (view?.typename) {
    case "SportView":
      sportURN = view.sport;
      break;
    case "EventView": {
      const eventURN = view.sportevent;
      const sportevent = eventURN ? getSportEventByURN(state.entities.sportevents, eventURN) : null;
      const competition = sportevent
        ? getCompetitionByURN(state.entities.competitions, sportevent.competition)
        : undefined;
      sportURN = competition?.sport;
      break;
    }
    case "MarketView": {
      const marketURN = view.mainMarket;
      const market =
        getExchangeMarketByURN(state.entities.exchangemarkets, marketURN) ||
        getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketURN);
      sportURN = market?.sport;
      break;
    }
    default:
      break;
  }

  const sport = sportURN ? getSportByURN(sports, sportURN) : null;
  const { sportId = null, name = null } = sport || {};

  return {
    sport_id: sportId,
    sport_name: name,
  };
};

export const getPageLoadEvent = async (
  state: ApplicationState,
  getCookie: GetCookie,
  platformType: PlatformType,
  theme: ThemeType,
): Promise<PageLoadEvent> => {
  const userDimensions = await getUserDimensions(state, getCookie);
  const marketingDimensions = await getMarketingDimensions(getCookie);
  const productDimensions = getProductDimensions(state, platformType, theme);
  const environmentDimensions = getEnvironmentDimensions(platformType);
  const pageDimensions = getPageDimensions(state);
  const testDimensions = getTestDimensions(state);

  return {
    event: "ga_pageLoad",
    ...environmentDimensions,
    ...marketingDimensions,
    ...pageDimensions,
    ...productDimensions,
    ...testDimensions,
    ...userDimensions,
  };
};
