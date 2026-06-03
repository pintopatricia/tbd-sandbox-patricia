import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsSupportingContentButtonsCardGroupTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsSupportingContentButtonsCardGroupTrackingQuery = gql(/* GraphQL */ `
  query StatsSupportingContentButtonsCardGroupTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsSupportingContentButtonsCardGroupTrackingParams
    }
  }
`);

export const StatsSupportingContentButtonsCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsSupportingContentButtonsCardGroupTrackingParams on StatsSupportingContentButtonsCardGroup {
    __typename
    urn
    items {
      edges {
        displayName {
          ... on DisplayNameTranslationKey {
            translationKey
          }
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

export async function getStatsSupportingContentButtonsCardGroup(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsSupportingContentButtonsCardGroup",
    urn,
  });

  let cachedData: StatsSupportingContentButtonsCardGroupTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsSupportingContentButtonsCardGroupFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsSupportingContentButtonsCardGroupTrackingQuery);
    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsSupportingContentButtonsCardGroupTrackingParamsFragment =>
            !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: StatsSupportingContentButtonsCardGroupFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
