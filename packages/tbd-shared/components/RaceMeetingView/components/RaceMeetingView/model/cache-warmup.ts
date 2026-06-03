import type { ApolloCache } from "@apollo/client";
import type { RaceMeetingViewQuery } from "../../../../../types/__generated__/graphql";
import { RaceItemsContentQuery } from "../../RaceItemsContent/model/RaceItemsContent.graphql";

type RaceMeetingView = Extract<NonNullable<RaceMeetingViewQuery["View"]>, { __typename: "RaceMeetingView" }>;

/**
 * Writes the initial items data into the cache under the parameterized
 * `items(race: $race)` key so that RaceItemsContentQuery gets a cache hit
 * instead of re-fetching.
 */
export function cacheWarmup(cache: ApolloCache, view: RaceMeetingView | undefined) {
  const raceUrn = view?.items?.selectedRace?.race.urn;
  if (!view || !raceUrn) return;

  cache.writeQuery({
    query: RaceItemsContentQuery,
    variables: { viewURN: view.urn, race: raceUrn },
    data: {
      View: {
        __typename: "RaceMeetingView" as const,
        urn: view.urn,
        races: view.races,
        items: view.items,
      },
    },
  });
}
