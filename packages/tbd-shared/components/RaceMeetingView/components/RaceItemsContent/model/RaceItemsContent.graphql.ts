import { useQuery } from "@apollo/client/react";
import { gql } from "../../../../../types/__generated__";

export const RaceItemsContentQuery = gql(/* GraphQL */ `
  query RaceMeetingViewItems($viewURN: URN!, $race: URN) {
    View(viewURN: $viewURN) {
      ... on RaceMeetingView {
        urn
        races {
          ...RaceNavigationItem
        }
        items(race: $race) {
          selectedRace {
            ...RaceNavigationItem
          }
          edges {
            node {
              ... on RaceResultsCard {
                __typename
                urn
              }
              ... on RegulatoryCard {
                __typename
                urn
              }
              ... on NavigationTabsList {
                __typename
                urn
              }
            }
            cursor
            theme
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`);

/**
 * Race-scoped items query. Uses cache-and-network so that cached data (either
 * from a previous visit or from cacheWarmup for the default race) renders
 * immediately while a background fetch keeps it fresh. Callers can pass
 * `skip: true` to defer execution (e.g. when initialItems already covers
 * the default race on initial entry).
 */
export const useRaceItemsContentQuery = (
  variables: { viewURN: string; race: string | undefined },
  options?: { skip?: boolean },
) => {
  const { data, loading, refetch, previousData } = useQuery(RaceItemsContentQuery, {
    variables: { viewURN: variables.viewURN, race: variables.race ?? null },
    skip: !variables.race || options?.skip,
  });

  const view = data?.View;
  const items = view && "urn" in view ? view.items : undefined;
  const previousView = previousData?.View;
  const previousItems = previousView && "urn" in previousView ? previousView.items : undefined;

  return {
    loading,
    refetch,
    data: {
      items,
      previousItems,
    },
  };
};
