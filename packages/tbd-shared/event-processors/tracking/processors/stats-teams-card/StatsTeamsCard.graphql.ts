import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import type { StatsTeamsCardExpandIconTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsTeamsCardExpandIconTrackingQuery = gql(/* GraphQL */ `
  query StatsTeamsCardExpandIconTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsTeamsCardExpandIconTrackingParams
    }
  }
`);

export const StatsTeamsCardExpandIconFragment = gql(/* GraphQL */ `
  fragment StatsTeamsCardExpandIconTrackingParams on StatsTeamsCard {
    __typename
    urn
    fixture {
      urn
      sportevent {
        urn
        name
        competition {
          urn
          name
        }
      }
    }
  }
`);

export async function getStatsTeamsCard(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsTeamsCard",
    urn,
  });

  let cachedData: StatsTeamsCardExpandIconTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsTeamsCardExpandIconFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsTeamsCardExpandIconTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsTeamsCardExpandIconTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      if (newCardData) {
        cache.writeFragment({
          fragment: StatsTeamsCardExpandIconFragment,
          id,
          data: newCardData,
        });

        cachedData = newCardData;
      }
    }
  }

  return cachedData;
}
