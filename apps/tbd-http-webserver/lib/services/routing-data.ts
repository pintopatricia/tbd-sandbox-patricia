import { URL } from "url";
import { findRoute } from "@ppb/tbd-routes";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import { codecs } from "@ppb/tbd-urn-codecs";

const mockBaseUrl = "https://mockUrl/";

/**
 * Removes the slash from beginning of the path
 */
function removeForwardSlash(urlPathName: string, urlSearch: string): string {
  return `${urlPathName.substring(1)}${urlSearch}`;
}

/**
 * Removes product query param from the url
 */
function removeProductQueryParam(relativePath: string): string {
  const url = new URL(relativePath, mockBaseUrl);

  url.searchParams.delete("product");
  url.searchParams.delete("tokens");
  url.searchParams.delete("brand");
  url.searchParams.delete("theme");

  const { pathname, search } = url;

  return removeForwardSlash(pathname, search);
}

export default function getRoutingData(
  base: string,
  requestUri = "",
  queryParams: { product?: string; customTokens?: string; customBrand?: string; customTheme?: string } = {},
): RouterState {
  let urlPath;
  if (`${decodeURI(requestUri)}/` === base) {
    urlPath = "";
  } else {
    urlPath = decodeURI(requestUri).replace(base, "");
  }
  let currentUrl = "";

  if (queryParams.product || queryParams.customTokens || queryParams.customBrand || queryParams.customTheme) {
    currentUrl = removeProductQueryParam(urlPath);
  } else {
    currentUrl = urlPath;
  }

  const urn = currentUrl ? findRoute(urlPath) || codecs.notFoundView.encode() : codecs.genericView.home.encode();

  return {
    currentTabUrn: null,
    currentUrn: urn.uid,
    currentView: urn.type,
    currentUrl,
    locationKey: null,
    firstLocationKey: null,
    isRefreshing: false,
    showBackButton: false,
  };
}
