import { SearchViewQuery } from "../../clients/catalogue/catalogue-response-types";
import { SearchResultItem } from "../../state/layout/views/browse-view/Browse.types";
import { SearchResult } from "../../state/layout/views/browse-view/BrowseInterface.types";

/**
 * Transform GQL search result into a SearchResult filtering empty results.
 *
 * @param searchResults Search results retrieved by BFF
 * @returns The filtered search results
 */
export const buildSearchResult = (searchResults: SearchViewQuery): SearchResult => {
  const { query, pageSize, startIndex, didYouMean, results } = searchResults.Search;

  const mappedResults =
    results?.reduce<SearchResultItem[]>((acc, result) => {
      if (!result || !("__typename" in result)) {
        return acc;
      }

      if (result?.__typename === "EventView") {
        acc.push({
          type: "EVENT_SEARCH_RESULT_ITEM",
          urn: result.urn,
          url: result.url,
          name: result.sportevent.name,
          competition: result.sportevent.competition?.name,
          date: new Date(result.sportevent.openDate),
          sportId: result.sportevent.sport.sportId,
          sportName: result.sportevent.sport.name,
        });
      } else if (result?.__typename === "CompetitionView") {
        acc.push({
          type: "COMPETITION_SEARCH_RESULT_ITEM",
          urn: result.urn,
          url: result.url,
          name: result.competition.name,
          sportName: result.competition.sport.name,
          logo: result.competition.logo?.large || undefined,
          sportId: result.competition.sport.sportId,
        });
      } else if (result?.__typename === "RaceView") {
        acc.push({
          type: "RACE_SEARCH_RESULT_ITEM",
          name: result.race.name,
          urn: result.urn,
          url: result.url,
          date: new Date(result.race.startTime),
          meetingName: result.race.meeting.venue,
          sportId: result.race.sport.sportId,
          sportName: result.race.sport.name,
        });
      }
      return acc;
    }, []) ?? [];

  return {
    query,
    pageSize,
    startIndex,
    didYouMean,
    items: mappedResults,
  };
};
