import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { gql } from "../../../types/__generated__";
import { getApolloClient } from "../../../apollo-client/client";
import { hydrateItemCards } from "./HydratePebbleItemCards";

export const StatsPebbleCardGroupBaseDataFragment = gql(/* GraphQL */ `
  fragment StatsPebbleCardGroupBaseData on StatsPebbleCardGroup {
    __typename
    urn
    status
  }
`);

export const LocalStatsPebbleCardGroupFragment = gql(/* GraphQL */ `
  fragment LocalStatsPebbleCardGroup on StatsPebbleCardGroup {
    selectedPebble @client {
      urn
      typename
    }
  }
`);

export const StatsPebbleCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsPebbleCardGroup on StatsPebbleCardGroup {
    ...StatsPebbleCardGroupBaseData
    ...LocalStatsPebbleCardGroup
    full: items(first: 1, selectedOnly: true) {
      edges {
        displayName {
          ...DisplayNameStats
        }
        node {
          ... on StatsFormCard {
            ...StatsFormCardRecentForm
            ...StatsFormCardCompetitionForm
          }
          ... on StatsHeadToHeadCard {
            ...StatsHeadToHeadCard
          }
          ... on StatsTeamsCard {
            ...StatsTeamsCardPreviousFive
            ...StatsTeamsCardAllSeason
          }
          ... on StatsPlayersSeasonStatsCard {
            ...StatsPlayersSeasonStatsCardAttacking
            ...StatsPlayersSeasonStatsCardDefending
          }
          ... on StatsMatchStatsCard {
            ...StatsMatchStatsCard
          }
          ... on StatsGoalsAndShotsCard {
            ...StatsGoalsAndShotsCard
          }
          ... on IncidentsCard {
            ...IncidentsCard
          }
        }
      }
    }
    partials: items {
      edges {
        displayName {
          ...DisplayNameStats
        }
        ... on PebbleCardEdge {
          node {
            ... on StatsFormCard {
              __typename
              urn
            }
            ... on StatsHeadToHeadCard {
              __typename
              urn
            }
            ... on StatsTeamsCard {
              __typename
              urn
            }
            ... on StatsPlayersSeasonStatsCard {
              __typename
              urn
            }
            ... on StatsMatchStatsCard {
              __typename
              urn
            }
            ... on StatsGoalsAndShotsCard {
              __typename
              urn
            }
            ... on IncidentsCard {
              __typename
              urn
            }
          }
        }
      }
    }
  }

  fragment DisplayNameStats on DisplayNameTranslationKey {
    translationKey
  }
`);

export const StatsPebbleCardGroupQuery = gql(/* GraphQL */ `
  query StatsPebbleCardGroup($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsPebbleCardGroup
    }
  }
`);

const getLocalStatsPebbleCardGroupFromCache = (cardURN: string) => {
  const { cache } = getApolloClient();

  const cardLocalData = cache.readFragment({
    id: cache.identify({
      __typename: "StatsPebbleCardGroup",
      urn: cardURN,
    }),
    fragment: LocalStatsPebbleCardGroupFragment,
  });

  return cardLocalData;
};

export const writeLocalStatsPebbleCardGroupFragment = (
  cardURN: string,
  selectedPebble: { pebbleUrn: string; typename: string },
): void => {
  const { cache } = getApolloClient();
  const statsPebbleCardGroupCacheId = cache.identify({
    __typename: "StatsPebbleCardGroup",
    urn: cardURN,
  });

  cache.writeFragment({
    id: statsPebbleCardGroupCacheId,
    fragment: LocalStatsPebbleCardGroupFragment,
    data: {
      selectedPebble: {
        urn: selectedPebble.pebbleUrn,
        typename: selectedPebble.typename,
      },
    },
  });
};

const getStatsPebbleCardGroupBaseDataFromCache = (cardURN: string) => {
  const { cache } = getApolloClient();

  const cardBaseData = cache.readFragment({
    id: cache.identify({
      __typename: "StatsPebbleCardGroup",
      urn: cardURN,
    }),
    fragment: StatsPebbleCardGroupBaseDataFragment,
  });

  return cardBaseData;
};

export const useStatsPebbleCardGroupQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const hydrated = useRef(false);

  const [fetchCardGroup, { called, loading, data }] = useLazyQuery(StatsPebbleCardGroupQuery);

  const card = data?.Cards?.[0];
  const isStatsPebbleCardGroup = card && "__typename" in card;
  const statsPebbleCardGroup = isStatsPebbleCardGroup ? card : undefined;
  const cardLocalData = getLocalStatsPebbleCardGroupFromCache(variables.cardURN);
  const firstPebble = statsPebbleCardGroup?.partials.edges?.[0]?.node;

  useEffect(() => {
    // Hydrate the item cards if they are not already hydrated
    if (!hydrated.current && data) {
      hydrated.current = hydrateItemCards(data);
    }
  }, [data]);

  if (!cardLocalData?.selectedPebble?.urn && firstPebble && "__typename" in firstPebble) {
    // when first initializing, the first pebble needs to be selected
    writeLocalStatsPebbleCardGroupFragment(variables.cardURN, {
      pebbleUrn: firstPebble?.urn,
      typename: firstPebble?.__typename,
    });
  }

  useEffect(() => {
    if (options.visible) {
      fetchCardGroup({
        variables: {
          urn: variables.cardURN,
        },
      });
    }
  }, [options.visible, fetchCardGroup]);

  return {
    loading: !called || loading,
    data: {
      baseCard: getStatsPebbleCardGroupBaseDataFromCache(variables.cardURN),
      card: statsPebbleCardGroup,
    },
  };
};
