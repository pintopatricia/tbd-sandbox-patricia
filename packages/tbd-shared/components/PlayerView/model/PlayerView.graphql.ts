import { useQuery } from "@apollo/client/react";
import { gql } from "../../../types/__generated__";

export const PlayerViewFragment = gql(/* GraphQL */ `
  fragment PlayerView on PlayerView {
    __typename
    urn
    url
    title
    context {
      __typename
      ... on FootballPlayerFixtureContext {
        player {
          id
          urn
          name
          position
          shirtNumber
        }
        team {
          name
          color
        }
      }
    }
    items {
      edges {
        node {
          ...footballPlayerCompetitionStatsCard
          ... on PlayerMarketsCardGroup {
            __typename
            urn
          }
          ... on RegulatoryCard {
            __typename
            urn
          }
        }
      }
    }
  }
`);

export const PlayerViewQuery = gql(/* GraphQL */ `
  query PlayerView($urn: URN!) {
    View(viewURN: $urn) {
      ...PlayerView
    }
  }
`);

export const usePlayerViewQuery = (urn: string) => {
  const { loading, data } = useQuery(PlayerViewQuery, {
    variables: {
      urn,
    },
  });

  return {
    loading,
    data,
  };
};
