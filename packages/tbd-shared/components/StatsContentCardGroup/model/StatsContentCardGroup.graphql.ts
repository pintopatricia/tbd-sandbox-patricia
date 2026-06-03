import { useLazyQuery } from "@apollo/client/react";
import { generateLayoutSnapshot } from "@ppb/tbd-store/state/layout-snapshot";
import { useEffect } from "react";
import { gql } from "../../../types/__generated__";
import { getApolloClient } from "../../../apollo-client/client";

export const LocalStatsContentCardGroup = gql(/* GraphQL */ `
  fragment LocalStatsContentCardGroup on StatsContentCardGroup {
    selectedTab @client {
      urn
      typename
    }
  }
`);

export const StatsContentCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsContentCardGroup on StatsContentCardGroup {
    __typename
    urn
    ...LocalStatsContentCardGroup
    partials: items {
      edges {
        ... on StatsMatchStatsItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsPebbleItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsLineupsItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsMatchStatsItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsBroadcastsItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsTableItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
        ... on StatsPlayersInPlayItemEdge {
          displayName {
            translationKey
          }
          type
          node {
            urn
            __typename
          }
        }
      }
    }
  }
`);

export const StatsContentCardGroupQuery = gql(/* GraphQL */ `
  query StatsContentCardGroup($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsContentCardGroup
    }
  }
`);

export const writeStatsContentCardGroupFragment = (cardURN: string, isOpen: boolean, tabUrn = "", typename = "") => {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsContentCardGroup",
    urn: cardURN,
  });

  cache.writeFragment({
    id,
    fragment: LocalStatsContentCardGroup,
    data: {
      selectedTab: isOpen ? { urn: tabUrn, typename } : null,
    },
  });
};

export const useStatsContentCardGroupQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const [fetchCard, { called, loading, data }] = useLazyQuery(StatsContentCardGroupQuery);

  const card = data?.Cards?.[0];
  const isStatsContentCardGroup = card && "__typename" in card;
  const statsContentCardGroup = isStatsContentCardGroup ? card : undefined;

  useEffect(() => {
    if (!called && options.visible && !data) {
      fetchCard({ variables: { urn: variables.cardURN } });
    }
  }, [called, options.visible, data, fetchCard]);

  if (statsContentCardGroup) {
    generateLayoutSnapshot({ data: { StatsContentCardGroup: [statsContentCardGroup] } }, variables.cardURN);
  }

  return {
    loading: !called || loading,
    data: {
      card: statsContentCardGroup,
    },
  };
};
