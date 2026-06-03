import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsPlayersSeasonStatsTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsPlayersSeasonStatsTrackingQuery = gql(/* GraphQL */ `
  query StatsPlayersSeasonStatsTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsPlayersSeasonStatsTrackingParams
    }
  }
`);

export const StatsPlayersSeasonStatsFragment = gql(/* GraphQL */ `
  fragment StatsPlayersSeasonStatsTrackingParams on StatsPlayersSeasonStatsCard {
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

export async function getStatsPlayersSeasonStats(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsPlayersSeasonStatsCard",
    urn,
  });

  let cachedData: StatsPlayersSeasonStatsTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsPlayersSeasonStatsFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsPlayersSeasonStatsTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is StatsPlayersSeasonStatsTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: StatsPlayersSeasonStatsFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
