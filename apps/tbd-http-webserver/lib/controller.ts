import net from "node:net";
import {
  AppKeyType,
  buildAppContext,
  buildEnvironmentForJurisdiction,
  DefaultProductOption,
  EnvironmentJSON,
  LastViewedProductOption,
  ProductsOption,
  replaceDomainPlaceholders,
  resolveAppCommands,
  Throttles,
} from "@ppb/tbd-store";
import { InitialState } from "./@types/initial-state";
import { TbdCatalogue } from "./@types/tbd-catalogue";
import unsafeEnvironmentFile from "./config/environment.json";
import { HOME as homeURL } from "./config/redirect-urls.json";
import { SupportedJurisdiction } from "./constants/supported-jurisdictions";
import { buildContext, ThrottleOverrides } from "./context";
import {
  buildProductPreferenceCookies,
  setCookies,
  setEnvironmentCookie,
  setPhoenixEnabledCookie,
} from "./services/cookie-service";
import { getPhoenixRouting, ProductCluster } from "./helpers/phoenix-routing";
import { buildLinkHeaderValue } from "./early-hints-helper";
import { buildAssetsConfig } from "./helpers/assets-builder";
import { determineJurisdiction } from "./helpers/determine-jurisdiction";
import { getAppIdentifier } from "./helpers/get-app-identifiers";
import { getGAHtmlScripts } from "./services/google-analytics-service";
import { getLocaleFromURL } from "./services/jurisdictions-service";
import { fetchAppContext, fetchAppVersion, getPreloadedCatalogData } from "./services/preload-catalog-service";
import { getQueryParamsFromRequest } from "./services/query-params";
import htmlTemplate from "./templates/master";
import { UserContext } from "./@types/UserContext";
import { Log } from "./@types/Log";
import { RequestContext } from "./@types/RequestContext";
import { Header, HeaderService } from "./@types/HeaderService";
import { FabricParams } from "./@types/FabricParams";
import { LocalStorage } from "./@types/LocalStorage";
import { CookieService } from "./@types/CookieService";
import { getClientContext } from "./helpers/client-context";

function getDomain(host: string): string {
  const parts = host.split(".");

  // handle hostname with no subdomain e.g. skybet.com
  const domainParts = parts.length > 2 ? parts.slice(1) : parts;

  return domainParts.join(".");
}

function isNotIP(host: string): boolean {
  // 0 = not IP, 4 = IPv4, 6 = IPv6
  return net.isIP(host) === 0;
}

function setHeaders($headers: HeaderService, headers: Header[]): void {
  headers.forEach((h) => $headers.setHeader(h.name, h.value));
}

function setOverridenThrottles(throttles: Throttles, throttleOverrides: ThrottleOverrides): Throttles {
  const overridenThrottles: string[] = [...Array.from(throttleOverrides.on), ...Array.from(throttleOverrides.off)];

  return Object.fromEntries(
    Object.entries(throttles).map(([throttleName, value]) => {
      const isOverriden = overridenThrottles.some((overridenThrottle) => overridenThrottle === throttleName);
      const throttleValue = { ...value };

      if (isOverriden) {
        throttleValue.isOverriden = true;
      }

      return [throttleName, throttleValue];
    }),
  );
}

const getRedirectHomeError = (
  environment: EnvironmentJSON,
  jurisdiction: SupportedJurisdiction,
  domain: string,
): Error => {
  const domainExtension = environment.DOMAIN_EXTENSIONS[jurisdiction];
  const redirectUrl = replaceDomainPlaceholders(homeURL, domainExtension, domain);

  return new TemporaryRedirectError(redirectUrl);
};

function getOverrideProduct(product: string): ProductsOption | undefined {
  if (product === "exc") return ProductsOption.exchange;
  if (product === "sbk") return ProductsOption.sportsbook;
  return undefined;
}

/**
 * Strand main function
 */
async function getResponse(
  $params: FabricParams,
  $localStorage: LocalStorage,
  $userContext: UserContext,
  $headers: HeaderService,
  $tbdCatalogue: TbdCatalogue,
  $cookies: CookieService,
  $log: Log,
  $requestContext: RequestContext,
): Promise<string> {
  const domain = $requestContext.host && isNotIP($requestContext.host) ? getDomain($requestContext.host) : "";
  const environment = buildEnvironmentForJurisdiction(
    unsafeEnvironmentFile as unknown as EnvironmentJSON,
    $userContext.jurisdiction.jurisdiction,
    domain,
  );

  // checks if the user jurisdiction is supported by TBD
  const jurisdiction = determineJurisdiction($userContext.jurisdiction.jurisdiction);
  if (!jurisdiction) {
    throw new Error(`Jurisdiction is not supported by TBD: ${$userContext.jurisdiction.jurisdiction}`);
  }

  const uriHeader = $headers.getHeader("X-Request-URI");
  let requestUri: string;
  try {
    requestUri = decodeURI(uriHeader);
  } catch {
    $log.warn(`Malformed URL: ${uriHeader}`);

    throw getRedirectHomeError(environment, jurisdiction, domain);
  }

  // Extracts query params from a whitelist
  const queryParams = getQueryParamsFromRequest(requestUri);
  if (queryParams.drk && queryParams.drk.length > 0) {
    setEnvironmentCookie($cookies, $params, "drk", queryParams.drk);
  }

  const { base, localeCode } = getLocaleFromURL({
    $requestContext,
    requestUri,
    environment,
    jurisdiction,
    userLocaleCode: $userContext.localeCode,
    isLoggedIn: $userContext.loggedIn,
  });

  const throttleOverrides: ThrottleOverrides =
    process.env.NODE_ENV === "production"
      ? {
          on: new Set<string>(),
          off: new Set<string>(),
        }
      : {
          on: new Set(queryParams.throttlesOn !== "" ? queryParams.throttlesOn.split(",") : []),
          off: new Set(queryParams.throttlesOff !== "" ? queryParams.throttlesOff.split(",") : []),
        };

  try {
    const { manifest, cookies, router } = await buildContext(
      $params,
      $userContext,
      $headers,
      $cookies,
      $localStorage,
      localeCode,
      requestUri,
      queryParams,
    );

    const excEnabled = queryParams.exchangeEnabled === "true";
    const devTools = queryParams.devTools === "true";

    const clientContext = getClientContext($headers, $log, queryParams);
    const appIDs = getAppIdentifier(clientContext, environment);

    const [appContextResult, appVersionResult] = await Promise.allSettled([
      fetchAppContext($tbdCatalogue, localeCode, $headers, $params, appIDs.appKey, throttleOverrides),
      fetchAppVersion($tbdCatalogue, localeCode, $headers, $params, appIDs.appKey, throttleOverrides),
    ]);

    const appContextResponse = appContextResult.status === "fulfilled" ? appContextResult.value : undefined;
    const appVersionResponse = appVersionResult.status === "fulfilled" ? appVersionResult.value : undefined;

    if (!appContextResponse) {
      throw new Error(`Failed to get app context from BFF`);
    }

    const appKeyType =
      appIDs.channel === "WEB_DESKTOP" || appIDs.channel === "WRAPPER_DESKTOP" ? AppKeyType.DESKTOP : AppKeyType.MOBILE;

    const overrideProduct = getOverrideProduct(queryParams.product);
    const {
      initialState: { entities, boot },
      environment: parsedEnvironment,
    } = buildAppContext({
      appContextResponse: appContextResponse.data,
      environment,
      productId: appIDs.productId,
      appVersionResponse: appVersionResponse?.data,
      appKeyType,
      overrideProduct,
    });
    const { experiments, throttles, preferences, brandSettings, userdetails, appversion } = entities;

    const isProductOverridden = overrideProduct && boot?.canUsePhoenixExchange;
    if (isProductOverridden && overrideProduct === ProductsOption.exchange) {
      setPhoenixEnabledCookie($cookies, $params, true);
    }

    const phoenixCluster: ProductCluster =
      process.env.PRODUCT_CLUSTER === "EXC" ? ProductCluster.EXCHANGE : ProductCluster.SPORTSBOOK;
    const routingResult = getPhoenixRouting({
      cluster: phoenixCluster,
      resolvedProduct: preferences?.products?.[0] ?? ProductsOption.sportsbook,
      isExcAllowedJurisdiction: !!throttles.EXC_ALLOWED_JURISDICTION?.isActive,
      isLoggedIn: !!userdetails?.loggedIn,
      currentCookies: {
        tbd_dp: $cookies.getCookie("tbd_dp"),
        tbd_lvp: $cookies.getCookie("tbd_lvp"),
      },
      uspPreferences: {
        defaultProduct: preferences?.defaultProduct ?? DefaultProductOption.sportsbook,
        lastViewedProduct: preferences?.lastViewedProduct ?? LastViewedProductOption.sportsbook,
      },
    });

    setCookies($cookies, [...cookies, ...buildProductPreferenceCookies($params, routingResult.cookieCorrections)]);

    if (routingResult.action === "bounce") {
      throw new TemporaryRedirectError(routingResult.bounceUrl);
    }

    const appSuitableEnvironment = {
      ...parsedEnvironment,
      PRODUCT_ID: appIDs.productId,
      APP_KEY: appIDs.appKey,
      ENDPOINTS: {
        ...parsedEnvironment.ENDPOINTS,
        CBS: {
          ...parsedEnvironment.ENDPOINTS.CBS,
          channel: appIDs.cbsChannel,
        },
      },
    };

    const initialState: InitialState = {
      boot: {
        // STSIER: To be deleted in the future on another us.
        exchangeEnabled: excEnabled,
        devTools,
        ...boot,
      },
      entities: {
        productId: appIDs.productId,
        appkey: appIDs.appKey,
        appkeytype: appKeyType,
        appversion,
        userdetails,
        throttles: setOverridenThrottles(throttles, throttleOverrides),
        experiments,
        preferences,
        brandSettings,
      },
      router,
    };

    const treatedThrottles = initialState.entities.throttles;
    const GAConfig = getGAHtmlScripts(treatedThrottles, environment);

    const preloadedData = await getPreloadedCatalogData(
      $tbdCatalogue,
      router,
      appContextResponse.data.AppContext,
      localeCode,
      treatedThrottles,
      $headers,
      $params,
      environment,
      appIDs.appKey,
      throttleOverrides,
      $log,
      preferences.products,
    );

    const assets = buildAssetsConfig(
      $log,
      manifest,
      appSuitableEnvironment,
      environment,
      initialState.entities?.userdetails?.localeCode || "en_GB",
      jurisdiction,
      domain,
      preloadedData,
    );

    const isEarlyHintsEnabled = treatedThrottles.USE_SERVER_PUSH?.isActive;
    const headers: Header[] = [];
    if (isEarlyHintsEnabled) {
      try {
        headers.push({
          name: "Link",
          value: buildLinkHeaderValue(base, assets),
        });
      } catch (error) {
        if (error instanceof Error) {
          $log.error(`Link header assets error: ${error.message} ${error.stack}`);
        }
      }
    }

    setHeaders($headers, headers);

    const appCommands = resolveAppCommands($log.error, initialState.router.currentUrl);
    const webWrappedExperience = brandSettings?.SUPPORT_NATIVE_WRAPPER && !!clientContext.wrapper?.wrapperName;

    return htmlTemplate({
      base,
      assets,
      appSuitableEnvironment,
      initialState,
      environment,
      $requestContext,
      queryParams,
      preloadedData,
      appContext: appContextResponse.data,
      appCommands,
      GAConfig,
      clientContext: { ...clientContext, webWrappedExperience },
    });
  } catch (e) {
    if (e instanceof TemporaryRedirectError) throw e;
    $log.error("Error while attempting to access TBD", e instanceof Error ? e.stack : e);
    throw getRedirectHomeError(environment, jurisdiction, domain);
  }
}

export default getResponse;
