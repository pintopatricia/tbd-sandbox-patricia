import {
  AppCommands,
  EnvironmentConfig,
  EnvironmentJSON,
  ContentLoadingParameters,
  RenUserAgents,
} from "@ppb/tbd-store";

import { AppContextQuery } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import domPurify from "isomorphic-dompurify";

import { PAGE_TITLE, PAGE_DESCRIPTION } from "../config/environment-backend.json";
import { InitialState } from "../@types/initial-state";
import { HttpWebserverQueryParams } from "../@types/http-webserver-types";
import {
  buildAssetsConfig,
  LinkAssetDefinition,
  ScriptAssetDefinition,
  SignalFXAssetDefinition,
} from "../helpers/assets-builder";
import { ClientContext } from "../helpers/client-context";
import { PreloadedData } from "../services/preload-catalog-service";
import { RequestContext } from "../@types/RequestContext";

const DEFAULT_LOCALE = "en_GB";

function getContentLoadingParameters(renUserAgents: RenUserAgents, userAgent: string): ContentLoadingParameters {
  if (Object.values(renUserAgents).includes(userAgent)) {
    return {
      catalog: true,
      sportsbookPrices: true,
      exchangePrices: true,
      isDesktop: userAgent === renUserAgents.DESKTOP,
    };
  }

  return {};
}

function buildLinkTag(asset: LinkAssetDefinition): string {
  const path = `href="${asset.name}"`;
  const crossorigin = asset.crossorigin ? "crossorigin" : "";
  const as = asset.as ? `as="${asset.as}"` : "";
  const rel = asset.rel ? `rel="${asset.rel}"` : "";
  const priority = asset.priority ? `fetchpriority="high"` : "";

  const attrs = [path, rel, crossorigin, as, priority].filter((a) => a).join(" ");

  return `<link ${attrs} />`;
}

function buildScriptTag(asset: ScriptAssetDefinition): string {
  const src = `src="${asset.name}"`;
  const defer = asset.defer ? ` defer="${asset.defer}"` : "";
  const async = asset.async ? ` async` : "";

  const attrs = [src, defer, async].filter((a) => a).join(" ");

  return `<script ${attrs}></script>`;
}

function buildSignalFXInit(asset: SignalFXAssetDefinition): string {
  const splunkInit = `
    SplunkRum.init({
      realm: "${asset.realm}",
      rumAccessToken: "${asset.accessToken}",
      applicationName: "${asset.name}",
      disableAutomationFrameworks: "${asset.disableAutomationFrameworks ?? true}",
      instrumentations: {
        connectivity: "${asset?.instrumentations?.connectivity ?? true}",
        visibility: "${asset?.instrumentations?.visibility ?? true}",
      },
      disableBots: "${asset.disableBots ?? true}",
      deploymentEnvironment: "${asset.environment}",
      tracer: {
        sampler: new SplunkRum.SessionBasedSampler({
        ratio: ${asset.sampleRatio}
      }),
    },
    });
  `;
  const splunkSessionRecording = asset.sessionRecording
    ? `
    SplunkSessionRecorder.init({
      app: "${asset.name}",
      realm: "${asset.realm}",
      rumAccessToken: "${asset.accessToken}"
    });
  `
    : "";
  return `
    <script>
      ${splunkInit}
      ${splunkSessionRecording}
    </script>
  `;
}

function sanitizeRecursive<T>(obj: T): T {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const sanitizedObj: any = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key];

    if (typeof value === "string") {
      sanitizedObj[key] = domPurify.sanitize(value, {
        USE_PROFILES: { html: true },
      });
    } else if (value instanceof Date) {
      sanitizedObj[key] = value;
    } else if (typeof value === "object" && value !== null) {
      sanitizedObj[key] = sanitizeRecursive(value);
    } else {
      sanitizedObj[key] = value;
    }
  });

  return sanitizedObj as T;
}

function sanitizeObj<T>(obj: T): string {
  if (!obj) {
    return "undefined";
  }

  const sanitizedObj = sanitizeRecursive(obj);

  return JSON.stringify(sanitizedObj);
}

type GA4Tags = {
  head: string;
  body: string;
};
type GTMTags = {
  ga4: GA4Tags;
  ua: string;
};

function buildCustomTokensStylesheet(
  queryParams: HttpWebserverQueryParams,
  environmentConfig: EnvironmentConfig,
): string {
  if (process.env.NODE_ENV === "production") {
    return "";
  }

  const { customTokens, customBrand, customTheme } = queryParams;
  if (!customTokens || !customBrand || !customTheme) {
    // We only want to run it if all query parameters are present
    return "";
  }

  // override ENV name when loading custom tokens. when set, displays a banner in the UI for better visibility
  environmentConfig.ENV = `tokens preview (${customTokens})`;

  return `<link rel="stylesheet" href="https://artifactory-prd.prd.betfair/artifactory/NodeJS/%40ppb/the-wall-design-tokens/-/%40ppb/the-wall-design-tokens-${customTokens}.tgz!/package/generated/${customBrand}/core/web/fonts.css">
        <link rel="stylesheet" href="https://artifactory-prd.prd.betfair/artifactory/NodeJS/%40ppb/the-wall-design-tokens/-/%40ppb/the-wall-design-tokens-${customTokens}.tgz!/package/generated/${customBrand}/core/web/${customTheme}.css">`;
}

export default function template({
  base,
  assets,
  appSuitableEnvironment,
  initialState,
  environment,
  $requestContext,
  queryParams,
  preloadedData,
  appContext,
  appCommands,
  GAConfig,
  clientContext,
}: {
  base: string;
  assets: ReturnType<typeof buildAssetsConfig>;
  appSuitableEnvironment: EnvironmentConfig;
  initialState: InitialState;
  environment: EnvironmentJSON;
  $requestContext: RequestContext;
  queryParams: HttpWebserverQueryParams;
  preloadedData?: PreloadedData;
  appContext?: AppContextQuery;
  appCommands: AppCommands;
  GAConfig: GTMTags;
  clientContext: ClientContext & { webWrappedExperience: boolean };
}): string {
  const contentLoadingParameters = getContentLoadingParameters(environment.REN_USER_AGENTS, $requestContext.userAgent);

  const postLoginSession = queryParams.loginStatus === "SUCCESS";
  const userLocale = initialState.entities?.userdetails?.localeCode || DEFAULT_LOCALE;
  const [localeCode] = userLocale.split("_");
  const pageTitle = PAGE_TITLE ?? "Online Sports Betting";
  const pageDescription = PAGE_DESCRIPTION ?? "";

  return `
    <!DOCTYPE html>
    <html lang="${localeCode}">
      <head>
        ${GAConfig.ga4.head}
        <script>window.prerenderReady = false;</script>
        <meta charset="utf-8" />
        <title>${pageTitle}</title>
        <meta name="description" content="${pageDescription}" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <base id="tbdBase" href="${base}" />
        <link rel="icon" href="${base}${base.endsWith("/") ? "" : "/"}tbd/assets/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="${base}${base.endsWith("/") ? "" : "/"}tbd/assets/favicon-apple.png" />
        <link rel="manifest" href="${base}${base.endsWith("/") ? "" : "/"}tbd/assets/manifest.webmanifest" />
        ${assets.SIGNALFX_BACKGROUND_SERVICE ? buildScriptTag(assets.SIGNALFX_BACKGROUND_SERVICE) : ""}
        ${assets.SIGNALFX ? buildScriptTag(assets.SIGNALFX) : ""}
        ${assets.SIGNALFX_SESSION_RECORDING ? buildScriptTag(assets.SIGNALFX_SESSION_RECORDING) : ""}
        ${assets.SIGNALFX_META ? buildSignalFXInit(assets.SIGNALFX_META) : ""}
        ${assets.PRECONNECT_ORIGINS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.PRELOAD_JS_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.CATALOG_PRELOAD_JS_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.PRELOAD_ICON_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.PRELOAD_FONTS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.PRELOAD_CSS_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.CATALOG_PRELOAD_CSS_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${assets.PRELOAD_IMG_ASSETS.map((asset) => buildLinkTag(asset)).join("")}
        ${buildCustomTokensStylesheet(queryParams, appSuitableEnvironment)}
      </head>
      <body>
        ${GAConfig.ga4.body}
        <div id="root"></div>
        <script>
          window.__PRELOADED_STATE__ = ${sanitizeObj(initialState)}
          window.__TBD_ENVIRONMENT__ = ${sanitizeObj(appSuitableEnvironment)}
          window.__TBD_PRELOADED_CATALOG__ = ${sanitizeObj(preloadedData?.viewRequestPayload)}
          window.__CONTENT_LOADING_PARAMETERS__ = ${sanitizeObj(contentLoadingParameters)}
          window.__POST_LOGIN_SESSION__ = ${postLoginSession}
          window.__TBD_APP_COMMANDS__ = ${sanitizeObj(appCommands)}
          window.__APP_CONTEXT__ = ${sanitizeObj(appContext)}
          window.__TBD_CLIENT_CONTEXT__ = ${sanitizeObj(clientContext)}
        </script>
        ${assets.JS_SCRIPTS.map((asset) => buildScriptTag(asset)).join("")}
        ${assets.CATALOG_PRELOAD_JS_ASSETS.map((asset) => buildScriptTag(asset)).join("")}
        ${GAConfig.ua}
      </body>
    </html>
  `;
}
