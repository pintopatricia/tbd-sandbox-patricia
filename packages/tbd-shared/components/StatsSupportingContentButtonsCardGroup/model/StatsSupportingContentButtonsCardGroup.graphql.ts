import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useRef } from "react";
import { gql } from "../../../types/__generated__";
import { hydrateItemCards } from "./HydrateStatsSupportingContentButtonsCardGroup";

export const StatsSupportingContentButtonsCardGroupBaseDataFragment = gql(/* GraphQL */ `
  fragment StatsSupportingContentButtonsCardGroupBaseData on StatsSupportingContentButtonsCardGroup {
    __typename
    urn
  }
`);

export const StatsSupportingContentButtonsCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsSupportingContentButtonsCardGroup on StatsSupportingContentButtonsCardGroup {
    ...StatsSupportingContentButtonsCardGroupBaseData
    full: items(first: 2) {
      edges {
        displayName {
          ...DisplayNameStats
        }
        node {
          ... on StatsMatchStatsCard {
            ...StatsMatchStatsCard
          }
          ... on IncidentsCard {
            ...IncidentsCard
          }
          ... on StatsBroadcastsCard {
            ...StatsBroadcastsCard
          }
          ... on StatsRaceResultsCard {
            ...StatsRaceResultsCard
          }
        }
      }
    }
    partials: items {
      edges {
        displayName {
          ...DisplayNameStats
        }
        ... on StatsSupportingContentButtonsCardEdge {
          node {
            ... on StatsMatchStatsCard {
              __typename
              urn
            }
            ... on IncidentsCard {
              __typename
              urn
            }
            ... on StatsBroadcastsCard {
              __typename
              urn
            }
            ... on StatsRaceResultsCard {
              __typename
              urn
            }
          }
        }
      }
    }
  }
`);

export const StatsSupportingContentButtonsCardGroupQuery = gql(/* GraphQL */ `
  query StatsSupportingContentButtonsCardGroup($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsSupportingContentButtonsCardGroup
    }
  }
`);

export const useStatsSupportingContentButtonsCardGroupQuery = (
  variables: { cardURN: string },
  options: { visible: boolean },
) => {
  const hydrated = useRef(false);

  const [fetchCardGroup, { called, loading, data }] = useLazyQuery(StatsSupportingContentButtonsCardGroupQuery);

  const card = data?.Cards?.[0];
  const isStatsSupportingContentButtonsCardGroup = card && "__typename" in card;
  const statsSupportingContentButtonsCardGroup = isStatsSupportingContentButtonsCardGroup ? card : undefined;

  useEffect(() => {
    // Hydrate the item cards if they are not already hydrated
    if (!hydrated.current && data) {
      hydrated.current = hydrateItemCards(data);
    }
  }, [data]);

  useEffect(() => {
    if (options.visible) {
      fetchCardGroup({ variables: { urn: variables.cardURN } });
    }
  }, [options.visible, fetchCardGroup, variables.cardURN]);

  return {
    loading: !called || loading,
    data: {
      card: statsSupportingContentButtonsCardGroup,
    },
  };
};
