import { codecs } from "@ppb/tbd-urn-codecs";
import GamingGlobalSearch from "../clients/games/GamingGlobalSearch";
import { SearchResultItem } from "../state/layout/views/browse-view/Browse.types";
import { SearchResult } from "../state/layout/views/browse-view/BrowseInterface.types";
import { createClientFactory } from "./client-factory";

const searchClientFactory = createClientFactory(GamingGlobalSearch);

export default {
  /**
   * Retrieve games results
   *
   * @returns Returns found games results
   */
  async getGamingSearchResults(query: string, localeCode: string, jurisdiction: string): Promise<SearchResult> {
    const searchClient = searchClientFactory("GAMING_SEARCH");
    const result = await searchClient.searchResults(query, localeCode, jurisdiction);

    const gameResults: SearchResultItem[] = Object.values(result.content).map((game) => {
      const gameCardUrn = codecs.card.gaming.game.encode("uid", game.uid);
      const results: SearchResultItem = {
        type: "GAME_SEARCH_RESULT_ITEM",
        urn: gameCardUrn.uid,
        name: game.data.display_name[0].text,
      };
      return results;
    });

    return {
      query,
      pageSize: 0,
      startIndex: 0,
      didYouMean: null,
      items: gameResults,
    };
  },
};
