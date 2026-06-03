import { get } from "@flutter-global/uki-channels-http-clients/src/request/request";
import { getApplicationKey } from "../../config/application-key";
import { Jurisdiction } from "../../state/constants";

const getProductByJurisdiction = (jurisdiction) => {
  switch (jurisdiction) {
    case Jurisdiction.SPAIN:
    case Jurisdiction.ITALY:
    case Jurisdiction.ROMANIA:
      return "xsellsportsbook";
    case Jurisdiction.DENMARK:
      return "casino";
    default:
      return "gaming";
  }
};

export function getSearchUrl(endpoint, query, language, jurisdiction) {
  const product = getProductByJurisdiction(jurisdiction);
  return `${endpoint}?platform=mobile&product=${product}&q=${query}&language=${language}&ugeMigrated=true`;
}

function GamingGlobalSearch(endpoint, options) {
  /**
   * Gets search results from Global Search Result strand
   *
   * @returns The list of all found games
   */
  async function searchResults(query, language, jurisdiction) {
    const searchUrl = getSearchUrl(endpoint, query, language, jurisdiction);
    let headers = {
      "X-Application": getApplicationKey(),
    };

    if (options?.overrideUserAgent) {
      headers = {
        ...headers,
        "User-Agent": options.overrideUserAgent,
      };
    }

    const response = await get(searchUrl, {
      headers,
      withCredentials: true,
    });
    return response.data;
  }
  return {
    searchResults,
  };
}
export default GamingGlobalSearch;
