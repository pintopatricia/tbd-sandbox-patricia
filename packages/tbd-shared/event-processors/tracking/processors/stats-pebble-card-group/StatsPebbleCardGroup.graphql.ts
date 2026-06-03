import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsPebbleCardGroupTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsPebbleCardGroupTrackingQuery = gql(/* GraphQL */ `
  query StatsPebbleCardGroupTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsPebbleCardGroupTrackingParams
    }
  }
`);

export const StatsPebbleCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsPebbleCardGroupTrackingParams on StatsPebbleCardGroup {
    __typename
    urn
    status
    items {
      edges {
        displayName {
          ... on DisplayNameTranslationKey {
            translationKey
          }
        }
        node {
          urn
          __typename
        }
      }
    }
    sportEvent {
      urn
      name
      competition {
        urn
        name
      }
    }
  }
`);

export async function getStatsPebbleCardGroup(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsPebbleCardGroup",
    urn,
  });

  let cachedData: StatsPebbleCardGroupTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsPebbleCardGroupFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsPebbleCardGroupTrackingQuery);
    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsPebbleCardGroupTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: StatsPebbleCardGroupFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
