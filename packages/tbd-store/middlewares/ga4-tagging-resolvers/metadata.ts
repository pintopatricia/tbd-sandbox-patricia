import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  RegistrationStatusType,
  ThemeType,
  ProductOptionType,
  MetaDataEvent,
  GA4MarketingDimensions,
  GA4ProductDimensions,
  GA4UserDimensions,
  GA4TestDimensions,
  GA4DeviceDimensions,
} from "../../state/tagging/PageLoad.types";
import { UserDetails, ProductsOption } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { createUserPreferencesWithProductSwitcherSelector } from "../../state/entities/user-preferences/user-preferences-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { createGetUserMainWalletValueSelector } from "../../state/entities/user-wallets/user-wallets-selectors";
import { getGtmBrand, getProductOptionPrefix, ProductTagging } from "../../helpers/tagging";
import { PlatformType } from "../../state/tagging/AnalyticsConstants";
import { isBetfairProduct } from "../../helpers/app-brand";

export type GetCookie = (cookieName: string) => Promise<string | null>;

const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

const getMarketingDimensions = async (getCookie: GetCookie): Promise<GA4MarketingDimensions> => ({
  rfr: (await getCookie("rfr")) || "null",
  pid: (await getCookie("pid")) || "null",
  ttp: (await getCookie("ttp")) || "null",
  bid: (await getCookie("bid")) || "null",
  promo_code: (await getCookie("promo_code")) || "null",
  sid: "null",
  efid: "null",
  clkid: "null",
  aff_id: "null",
  btag: "null",
  sub_id: "null",
  pi: "null",
  mi_u: "null",
  mi_ign: "null",
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
  const prefix = getProductOptionPrefix(state);

  const { currentView } = state.router;
  const { products } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
  const isSbkAvailable = products.includes(ProductsOption.sportsbook);

  switch (currentView) {
    case EntityType.MyAccountView:
      return `${prefix}_ecommerce`;
    case EntityType.GamingView:
    case EntityType.GamingCategoryView:
    case EntityType.GamingSegmentationView:
    case EntityType.GamingExternalView:
      return `${prefix}_gaming`;
    default: {
      // sportsbook/exchange distiction only applies to betfair product
      if (isBetfairProduct(state.entities.productId)) {
        return `${prefix}_${isSbkAvailable ? ProductTagging.Sportsbook : ProductTagging.Exchange}`;
      }
      return `${prefix}_bet`;
    }
  }
};

const getUserDimensions = async (state: ApplicationState, getCookie: GetCookie): Promise<GA4UserDimensions> => {
  const { countryCode, currencyCode, localeCode, accountId, loggedIn, jurisdiction } = <UserDetails>(
    getUserDetails(state)
  );
  const regStatus = await getRegistrationStatus(getCookie);
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const accountBalance = getUserMainWalletValue(state);

  // extract language from locale
  const language = localeCode.split("_")[0];

  return {
    account_id: accountId.toString(),
    user_id: loggedIn ? accountId.toString() : null,
    first_name: "null",
    last_name: "null",
    country: countryCode,
    jurisdiction: jurisdiction.jurisdiction,
    locale: localeCode,
    login_status: loggedIn ? "logged in" : "logged out",
    reg_status: regStatus,
    language: language || "null",
    account_balance: accountBalance?.toString() || "null",
    currency: currencyCode,
    city: "null",
  };
};

const getProductDimensions = (
  state: ApplicationState,
  platformType: PlatformType,
  theme: ThemeType,
): GA4ProductDimensions => {
  const productOption = getProductOption(state);
  const brand = getGtmBrand(state);

  return {
    brand,
    product: platformType,
    vertical: productOption,
    product_theme: theme,
    context: `${platformType}_${productOption}`,
  };
};

const getDeviceDimensions = (): GA4DeviceDimensions => {
  const orientation = window.screen?.orientation?.type;

  return {
    orientation: orientation || "null",
    connection_type: "null",
  };
};

const getTestDimensions = (state: ApplicationState): GA4TestDimensions => {
  const { bucketId } = <UserDetails>getUserDetails(state);
  return {
    bucket_id: bucketId,
  };
};

export const getMetaDataEvent = async (
  state: ApplicationState,
  getCookie: GetCookie,
  platformType: PlatformType,
  theme: ThemeType,
): Promise<MetaDataEvent> => {
  const userDimensions = await getUserDimensions(state, getCookie);
  const marketingDimensions = await getMarketingDimensions(getCookie);
  const productDimensions = getProductDimensions(state, platformType, theme);
  const testDimensions = getTestDimensions(state);
  const deviceDimensions = getDeviceDimensions();

  return {
    event: "metaData",
    ...marketingDimensions,
    ...productDimensions,
    ...testDimensions,
    ...userDimensions,
    ...deviceDimensions,
  };
};
