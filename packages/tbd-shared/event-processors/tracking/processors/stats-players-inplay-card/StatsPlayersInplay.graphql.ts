import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsPlayersInPlayTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsPlayersInPlayTrackingQuery = gql(/* GraphQL */ `
  query StatsPlayersInPlayTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsPlayersInPlayTrackingParams
    }
  }
`);

export const StatsPlayersInPlayFragment = gql(/* GraphQL */ `
  fragment StatsPlayersInPlayTrackingParams on StatsPlayersInPlayCard {
    __typename
    urn
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

export async function getStatsPlayersInPlay(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsPlayersInPlayCard",
    urn,
  });

  let cachedData: StatsPlayersInPlayTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsPlayersInPlayFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsPlayersInPlayTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsPlayersInPlayTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: StatsPlayersInPlayFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
