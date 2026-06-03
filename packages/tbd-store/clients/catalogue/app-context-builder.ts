import { AppContextData } from "../app-context/app-context-client";

import {
  AppContextDetails,
  ProductExclusion as CatalogueProductExclusion,
  AppContextQuery,
  AppVersionQuery,
  DefaultProduct,
  ExchangeDefaultProduct,
  ExchangeDefaultMode,
  QuickStake,
  UserProducts,
  OddsDisplayFormat,
  SportsFragment,
  LastViewedProduct,
} from "./catalogue-response-types";
import {
  DefaultProductOption,
  EnvironmentJSON,
  ExchangeDefaultModeOption,
  ExchangeDefaultProductOption,
  ExperimentsState,
  LastViewedProductOption,
  OddsDisplayPreference,
  ProductExclusion,
  ProductsOption,
  RefreshRates,
  ThrottlesState,
  UserState,
  RegistrationData,
  CountryCode,
  BrandSettings,
} from "../../state";
import { buildAppConfigEnvironment, mapAppVersion } from "../../helpers";
import { AppKeyType, InPlayOrNotInPlayRefreshRate } from "../../state/initial-state/Environment.types";
import { DEFAULT_INTERVALS } from "../../config/intervals";

type BuildAppContextPayload = {
  appContextResponse: AppContextQuery;
  environment: EnvironmentJSON;
  productId?: string;
  appVersionResponse?: AppVersionQuery;
  localeOverride?: { localeCode: string; localeCodeBcp47: string };
  appKeyType?: string;
  overrideProduct?: ProductsOption;
};

const PRODUCT_EXCLUSION_MAPPER: Record<CatalogueProductExclusion, ProductExclusion> = {
  [CatalogueProductExclusion.Games]: ProductExclusion.Games,
  [CatalogueProductExclusion.Virtuals]: ProductExclusion.Virtuals,
  [CatalogueProductExclusion.Sports]: ProductExclusion.Sports,
};

const USER_PRODUCT_MAPPER: Record<UserProducts, ProductsOption> = {
  [UserProducts.Exchange]: ProductsOption.exchange,
  [UserProducts.Sportsbook]: ProductsOption.sportsbook,
  [UserProducts.Games]: ProductsOption.games,
};

const DEFAULT_PRODUCT_MAPPER: Record<DefaultProduct, DefaultProductOption> = {
  [DefaultProduct.Exchange]: DefaultProductOption.exchange,
  [DefaultProduct.Sportsbook]: DefaultProductOption.sportsbook,
  [DefaultProduct.LastViewed]: DefaultProductOption.lastViewed,
};

const EXCHANGE_DEFAULT_PRODUCT_MAPPER: Record<ExchangeDefaultProduct, ExchangeDefaultProductOption> = {
  [ExchangeDefaultProduct.Ems]: ExchangeDefaultProductOption.ems,
  [ExchangeDefaultProduct.Neme]: ExchangeDefaultProductOption.neme,
  [ExchangeDefaultProduct.Unassigned]: ExchangeDefaultProductOption.default,
};

const LAST_VIEWED_PRODUCT_MAPPER: Record<LastViewedProduct, LastViewedProductOption> = {
  [LastViewedProduct.Exchange]: LastViewedProductOption.exchange,
  [LastViewedProduct.Sportsbook]: LastViewedProductOption.sportsbook,
};

const LAST_VIEWED_TO_PRODUCTS_MAPPER: Record<LastViewedProductOption, ProductsOption> = {
  [LastViewedProductOption.exchange]: ProductsOption.exchange,
  [LastViewedProductOption.sportsbook]: ProductsOption.sportsbook,
};

const EXCHANGE_DEFAULT_MODE_MAPPER: Record<ExchangeDefaultMode, ExchangeDefaultModeOption> = {
  [ExchangeDefaultMode.Default]: ExchangeDefaultModeOption.default,
  [ExchangeDefaultMode.Predicts]: ExchangeDefaultModeOption.predicts,
};

const ODDS_DISPLAY_MAPPER: Record<OddsDisplayFormat, OddsDisplayPreference> = {
  [OddsDisplayFormat.American]: OddsDisplayPreference.American,
  [OddsDisplayFormat.Decimal]: OddsDisplayPreference.Decimal,
  [OddsDisplayFormat.Fractional]: OddsDisplayPreference.Fractional,
};

function isNotNull<T>(item: T | null): item is T {
  return item !== null;
}

const PHOENIX_RECENT_ACCOUNT_CUTOFF = Date.parse("2026-12-31T00:00:00.000Z");

function isRecentPhoenixEligibleAccount(accountOpenDate?: string): boolean {
  if (!accountOpenDate) {
    return false;
  }

  const parsedAccountCreationDate = Date.parse(accountOpenDate);

  return !Number.isNaN(parsedAccountCreationDate) && parsedAccountCreationDate >= PHOENIX_RECENT_ACCOUNT_CUTOFF;
}

function mapRegistrationData(registration: AppContextQuery["AppContext"]["registration"]): RegistrationData | null {
  if (!registration) {
    return null;
  }

  return {
    joinNowLabel: registration.joinNowLabel ? registration.joinNowLabel : undefined,
    joinNowLink: registration.joinNowLink,
  };
}

function buildSportIntervalMap(
  sports: Array<SportsFragment | null> | null,
): Record<string, InPlayOrNotInPlayRefreshRate> {
  if (!sports) {
    return {};
  }

  return sports.reduce<Record<number, { inPlay: number; notInPlay: number }>>((acc, currSport) => {
    if (!currSport || !currSport.sportId) {
      return acc;
    }

    return {
      ...acc,
      [currSport.sportId]: {
        inPlay: currSport.inPlay,
        notInPlay: currSport.notInPlay,
      },
    };
  }, {});
}

export function mapPollCadencesToRefreshRates(
  pollcadences: AppContextQuery["AppContext"]["pollcadences"] | null,
): RefreshRates | null {
  if (pollcadences) {
    const pollcadencesSports = buildSportIntervalMap(pollcadences.COS.loggedIn.sports);

    return {
      ...pollcadences,
      COS: {
        loggedIn: {
          ...DEFAULT_INTERVALS.COS.loggedIn,
          default: pollcadences.COS.loggedIn.default,
          ...pollcadencesSports,
        },
        loggedOut: pollcadences.COS.loggedOut.default.inPlay || pollcadences.COS.loggedOut.default.notInPlay,
      },
    };
  }
  return null;
}

function mapEnvironment(
  environment: EnvironmentJSON,
  pollcadences: AppContextQuery["AppContext"]["pollcadences"] | null,
  registration: AppContextQuery["AppContext"]["registration"],
  productId: string,
): AppContextData["environment"] {
  const registrationData = mapRegistrationData(registration);
  const refreshRates = mapPollCadencesToRefreshRates(pollcadences);
  const depositEndpoint = new URL(environment.ENDPOINTS.DEPOSIT.path, environment.ENDPOINTS.DEPOSIT.host);
  depositEndpoint.searchParams.set("prod", productId);
  depositEndpoint.searchParams.set("showHeader", "0");

  const spendBudgetEndpoint = new URL(environment.ENDPOINTS.SPEND_BUDGET.path, environment.ENDPOINTS.SPEND_BUDGET.host);
  spendBudgetEndpoint.searchParams.set("prod", productId);
  spendBudgetEndpoint.searchParams.set("showHeader", "0");

  const ssoUrl = new URL(environment.SSO_URL);
  ssoUrl.searchParams.set("prod", productId);

  const mappedEnv = {
    ...environment,
    SSO_URL: ssoUrl.toString(),
    ENDPOINTS: {
      ...environment.ENDPOINTS,
      DEPOSIT: {
        ...environment.ENDPOINTS.DEPOSIT,
        path: `${depositEndpoint.pathname}${depositEndpoint.search}`,
      },
      SPEND_BUDGET: {
        ...environment.ENDPOINTS.SPEND_BUDGET,
        path: `${spendBudgetEndpoint.pathname}${spendBudgetEndpoint.search}`,
      },
    },
  };

  return buildAppConfigEnvironment(mappedEnv, registrationData, refreshRates);
}

function mapThrottles(throttles: AppContextDetails["throttles"]): ThrottlesState {
  return throttles.reduce(
    (acc, value) => ({
      ...acc,
      [value.name]: {
        name: value.name,
        isActive: value.isActive,
      },
    }),
    {} as ThrottlesState,
  );
}

function mapBrandSettings(brandSettings: AppContextDetails["brandSettings"]): BrandSettings {
  return brandSettings.reduce(
    (acc, value) => ({
      ...acc,
      [value.name]: value.isActive,
    }),
    {} as BrandSettings,
  );
}

function mapExperiments(experiments: AppContextQuery["AppContext"]["activeExperiments"]): UserState["experiments"] {
  return experiments.filter(isNotNull).reduce<ExperimentsState>((acc, experiment) => {
    acc[experiment.name] = { variant: experiment.variant };
    return acc;
  }, {});
}

export function getDefaultProduct(
  defaultProduct: DefaultProduct,
  lastViewedProduct: LastViewedProduct,
  overrideExchangeForPhoenixUser: boolean = false,
): ProductsOption {
  let defaultProductOption: ProductsOption;

  switch (defaultProduct) {
    case DefaultProduct.LastViewed:
      defaultProductOption = LAST_VIEWED_TO_PRODUCTS_MAPPER[LAST_VIEWED_PRODUCT_MAPPER[lastViewedProduct]];
      break;
    case DefaultProduct.Exchange:
      defaultProductOption = ProductsOption.exchange;
      break;
    case DefaultProduct.Sportsbook:
      defaultProductOption = ProductsOption.sportsbook;
      break;
    default:
      defaultProductOption = ProductsOption.sportsbook;
      break;
  }

  // If the user is not exchange phoenix migrated (EXC_ALLOWED_JURISDICTION is disabled or phoenixMigratedUser is false and logged in), fallback to sportsbook
  if (defaultProductOption === ProductsOption.exchange && overrideExchangeForPhoenixUser) {
    return ProductsOption.sportsbook;
  }

  return defaultProductOption;
}

function isPhoenixExchangeUser(
  throttles: ThrottlesState,
  { phoenixMigratedUser }: AppContextQuery["AppContext"]["preferences"],
  accountOpenDate?: string,
  appKeyType?: string,
): boolean {
  const isExcAllowedJurisdiction = !!throttles.EXC_ALLOWED_JURISDICTION?.isActive;
  const isMigratedUser = phoenixMigratedUser.isPhoenixMigratedUser;
  const isRecentEligibleUser = isRecentPhoenixEligibleAccount(accountOpenDate);
  const isChannelAvailable = appKeyType !== AppKeyType.DESKTOP || !!throttles.EXC_DESKTOP_EXPERIENCE?.isActive;

  return isExcAllowedJurisdiction && (isMigratedUser || isRecentEligibleUser) && isChannelAvailable;
}

function shouldFallbackExcUserToSbk(
  isLoggedIn: boolean,
  canUsePhoenixExchange: boolean,
  selectedExchangeDefaultProduct: ExchangeDefaultProduct | null,
) {
  // We keep the legacy NEME naming temporarily. In a future cleanup, validation for ExchangeDefaultProduct.Neme will be removed once the initial migration is complete.
  const isMigratedNemeUser = canUsePhoenixExchange && selectedExchangeDefaultProduct === ExchangeDefaultProduct.Neme;

  return isLoggedIn && !isMigratedNemeUser;
}

export function resolveEffectiveOverrideProduct({
  overrideProduct,
  isExcAllowedJurisdiction,
  isLoggedIn,
  isPhoenixUser,
}: {
  overrideProduct?: ProductsOption;
  isExcAllowedJurisdiction: boolean;
  isLoggedIn: boolean;
  isPhoenixUser: boolean;
}): ProductsOption | undefined {
  if (overrideProduct !== ProductsOption.exchange) {
    return overrideProduct;
  }

  const canOverrideToExchange = isExcAllowedJurisdiction && (!isLoggedIn || isPhoenixUser);
  return canOverrideToExchange ? overrideProduct : undefined;
}

export function mapProducts(
  { products, defaultProduct, lastViewedProduct, exchangeDefaultProduct }: AppContextQuery["AppContext"]["preferences"],
  canUsePhoenixExchange: boolean = false,
  isLoggedIn: boolean,
  overrideProduct?: ProductsOption,
): ProductsOption[] {
  if (!products.selectedProduct) {
    return [ProductsOption.sportsbook];
  }

  const selectedProducts = products.selectedProduct
    .filter((item): item is UserProducts => isNotNull(item))
    .map((item) => USER_PRODUCT_MAPPER[item]);
  const hasGames = selectedProducts.includes(ProductsOption.games);

  if (
    overrideProduct === ProductsOption.sportsbook ||
    (overrideProduct === ProductsOption.exchange && canUsePhoenixExchange)
  ) {
    return hasGames ? [overrideProduct, ProductsOption.games] : [overrideProduct];
  }

  const shouldTreatPhoenixUserAsSbk = shouldFallbackExcUserToSbk(
    isLoggedIn,
    canUsePhoenixExchange,
    exchangeDefaultProduct.selectedExchangeDefaultProduct,
  );
  const defaultUserProduct = getDefaultProduct(
    defaultProduct.selectedDefaultProduct,
    lastViewedProduct.selectedLastViewedProduct,
    shouldTreatPhoenixUserAsSbk,
  );

  return hasGames ? [defaultUserProduct, ProductsOption.games] : [defaultUserProduct];
}

function mapPreferences(preferences: AppContextQuery["AppContext"]["preferences"]): UserState["preferences"] {
  const {
    confirmCashout,
    defaultProduct,
    exchangeConfirmBetPlacement,
    exchangeDefaultProduct,
    exchangeOddsDisplay,
    favoriteSports,
    lastViewedProduct,
    oddsMovement,
    quickStakes,
    showBalances,
    sportsbookOddsDisplay,
    phoenixMigratedUser,
    exchangeDefaultMode,
  } = preferences;

  return {
    confirmCashout: confirmCashout.shouldConfirmCashout,
    defaultProduct: DEFAULT_PRODUCT_MAPPER[defaultProduct.selectedDefaultProduct],
    exchangeConfirmBetPlacement: exchangeConfirmBetPlacement.shouldConfirmBetPlacement,
    exchangeDefaultProduct: exchangeDefaultProduct.selectedExchangeDefaultProduct
      ? EXCHANGE_DEFAULT_PRODUCT_MAPPER[exchangeDefaultProduct.selectedExchangeDefaultProduct]
      : ExchangeDefaultProductOption.default,
    exchangeOddsDisplay: ODDS_DISPLAY_MAPPER[exchangeOddsDisplay.selectedOddsDisplayFormat],
    sportsbookOddsDisplay: ODDS_DISPLAY_MAPPER[sportsbookOddsDisplay.selectedOddsDisplayFormat],
    favoriteSports: favoriteSports.selectedFavoriteSports.map((sport) => sport.sportId),
    lastViewedProduct: LAST_VIEWED_PRODUCT_MAPPER[lastViewedProduct.selectedLastViewedProduct],
    oddsMovement: oddsMovement.shouldAcceptOddsMovement,
    quickStakes: quickStakes.selectedQuickStakes.filter((item): item is QuickStake => isNotNull(item)),
    showBalances: showBalances.shouldShowBalances,
    phoenixMigratedUser: phoenixMigratedUser.isPhoenixMigratedUser,
    exchangeDefaultMode: exchangeDefaultMode.selectedExchangeDefaultMode
      ? EXCHANGE_DEFAULT_MODE_MAPPER[exchangeDefaultMode.selectedExchangeDefaultMode]
      : ExchangeDefaultModeOption.default,
  };
}

function mapMigrationData(migrationData: AppContextQuery["AppContext"]["userdetails"]["migrationData"]) {
  return migrationData
    ? {
        heritageAccountId: migrationData.heritageAccountId ?? undefined,
        heritageSecondaryAccountId: migrationData.heritageSecondaryAccountId ?? undefined,
        heritageSystem: migrationData.heritageSystem ?? undefined,
        migrationDate: migrationData.migrationDate ?? undefined,
        migrationInformation: migrationData.migrationInformation ?? undefined,
      }
    : undefined;
}

export function buildAppContext({
  appContextResponse,
  environment,
  productId,
  appVersionResponse,
  localeOverride,
  appKeyType,
  overrideProduct,
}: BuildAppContextPayload): AppContextData {
  const { AppContext: appContext } = appContextResponse;
  const {
    userdetails: {
      accountId,
      bucketId,
      countryCode,
      currencyCode,
      excSettings,
      firstName,
      lastName,
      accountOpenDate,
      localeCode,
      localeCodeBcp47,
      loggedIn,
      lastLoginDate,
      timezone,
      region,
      jurisdiction,
      jurisdictionalData,
      productExclusions,
      migrationData,
    },
    activeExperiments,
    preferences,
    throttles,
    brandSettings,
    pollcadences,
    registration,
  } = appContext;
  const prodId = productId || environment.PRODUCT_ID;
  if (!prodId) {
    throw new Error("Product ID is required to build app context");
  }

  const mappedThrottles = mapThrottles(throttles);
  const mappedPreferences = mapPreferences(preferences);
  const isExcAllowedJurisdiction = !!mappedThrottles.EXC_ALLOWED_JURISDICTION?.isActive;
  const isPhoenixUser = isPhoenixExchangeUser(mappedThrottles, preferences, accountOpenDate || undefined, appKeyType);
  const effectiveOverrideProduct = resolveEffectiveOverrideProduct({
    overrideProduct,
    isExcAllowedJurisdiction,
    isLoggedIn: loggedIn,
    isPhoenixUser,
  });
  // It will be used to identify if user can access phoenix exchange or not
  const canUsePhoenixExchange = effectiveOverrideProduct === ProductsOption.exchange || isPhoenixUser;

  return {
    environment: mapEnvironment(environment, pollcadences, registration, prodId),
    initialState: {
      boot: {
        canUsePhoenixExchange,
      },
      entities: {
        productId: prodId,
        appversion: mapAppVersion(appVersionResponse),
        experiments: mapExperiments(activeExperiments),
        preferences: {
          ...mappedPreferences,
          products: mapProducts(preferences, canUsePhoenixExchange, loggedIn, effectiveOverrideProduct),
        },
        userdetails: {
          accountId,
          bucketId,
          countryCode: countryCode as CountryCode,
          currencyCode,
          excSettings,
          firstName,
          lastName,
          accountOpenDate: accountOpenDate || undefined,
          lastLoginDate: lastLoginDate ?? undefined,
          loggedIn,
          localeCode: localeOverride?.localeCode ?? localeCode,
          localeCodeBcp47: localeOverride?.localeCodeBcp47 ?? localeCodeBcp47,
          timezone,
          region,
          jurisdiction: {
            jurisdiction: jurisdiction.jurisdiction,
          },
          jurisdictionalData: jurisdictionalData
            ? {
                contractNumber: jurisdictionalData.contractNumber ?? undefined,
                nationalIdentifier: jurisdictionalData.nationalIdentifier ?? undefined,
              }
            : undefined,
          productExclusions: productExclusions
            .filter((productExclusion): productExclusion is CatalogueProductExclusion => !!productExclusion)
            .map((productExclusion) => PRODUCT_EXCLUSION_MAPPER[productExclusion]),
          migrationData: mapMigrationData(migrationData),
        },
        brandSettings: mapBrandSettings(brandSettings),
        throttles: mappedThrottles,
      },
    },
    queryResponse: appContextResponse,
  };
}
