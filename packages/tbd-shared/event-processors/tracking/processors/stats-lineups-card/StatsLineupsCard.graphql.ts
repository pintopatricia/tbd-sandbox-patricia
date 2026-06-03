import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsLineupsCardTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsLineupsCardTrackingQuery = gql(/* GraphQL */ `
  query StatsLineupsCardTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsLineupsCardTrackingParams
    }
  }
`);

export const StatsLineupsCardFragment = gql(/* GraphQL */ `
  fragment StatsLineupsCardTrackingParams on StatsLineupsCard {
    __typename
    urn
    status
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

export async function getStatsLineupsCard(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsLineupsCard",
    urn,
  });

  let cachedData: StatsLineupsCardTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsLineupsCardFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsLineupsCardTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsLineupsCardTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: StatsLineupsCardFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
