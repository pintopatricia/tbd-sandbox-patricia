import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import { Cookie, CookieService } from "./@types/CookieService";
import { FabricParams } from "./@types/FabricParams";
import { HeaderService } from "./@types/HeaderService";
import { LocalStorage } from "./@types/LocalStorage";
import { UserContext } from "./@types/UserContext";
import { HttpWebserverQueryParams } from "./@types/http-webserver-types";
import { extractBasePathFromRequestUri } from "./helpers/base-path";
import getManifest from "./manifest";
import { getCookiesToSet } from "./services/cookie-service";
import getRoutingData from "./services/routing-data";

export type ThrottleOverrides = {
  on: Set<string>;
  off: Set<string>;
};

type Context = {
  manifest: Record<string, string>;
  cookies: Cookie[];
  base: string;
  router: RouterState;
};

export async function buildContext(
  $params: FabricParams,
  $userContext: UserContext,
  $headers: HeaderService,
  $cookies: CookieService,
  $localStorage: LocalStorage,
  localeCode: string,
  requestUri: string,
  queryParams: HttpWebserverQueryParams,
): Promise<Context> {
  // Reads the webpack asset list
  const manifest = await getManifest($localStorage);

  // Determine the base path (e.g. /betting)
  const { base } = extractBasePathFromRequestUri(requestUri);

  // Determine the current route date
  const router = getRoutingData(base, requestUri, queryParams);

  // Determine which headers and cookies to be set
  const cookies = await getCookiesToSet($headers, $cookies, $params, $userContext, localeCode, router);

  return {
    manifest,
    cookies,
    base,
    router,
  };
}
