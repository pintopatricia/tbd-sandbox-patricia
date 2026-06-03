import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { gql } from "../../../../../types/__generated__";

export const PlayerMarketsCardGroupFragment = gql(/* GraphQL */ `
  fragment PlayerMarketsCardGroup on PlayerMarketsCardGroup {
    __typename
    urn
    fixtureCard {
      __typename
      urn
    }
    items {
      edges {
        node {
          ... on PebbleCardGroup {
            __typename
            urn
          }
        }
      }
    }
  }
`);

export const PlayerMarketsCardGroupQuery = gql(/* GraphQL */ `
  query PlayerMarketsCardGroup($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...PlayerMarketsCardGroup
    }
  }
`);

export const usePlayerMarketsCardGroupQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const [fetchCardGroup, { called, loading, data }] = useLazyQuery(PlayerMarketsCardGroupQuery);

  const cardGroup = data?.Cards?.[0];
  const isPlayerMarketsCardGroup = cardGroup && "__typename" in cardGroup;
  const playerMarketsCardGroup = isPlayerMarketsCardGroup ? cardGroup : undefined;

  useEffect(() => {
    if (!called && options.visible && !data) {
      fetchCardGroup({
        variables: {
          urn: variables.cardURN,
        },
      });
    }
  }, [options.visible, fetchCardGroup, called, data, variables.cardURN]);

  return {
    loading: !called && loading,
    called,
    data: {
      cardGroup: playerMarketsCardGroup,
    },
  };
};
