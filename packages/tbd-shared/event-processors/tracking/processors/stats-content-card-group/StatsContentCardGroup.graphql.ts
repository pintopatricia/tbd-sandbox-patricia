import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { StatsContentCardGroupTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const StatsContentCardGroupTrackingQuery = gql(/* GraphQL */ `
  query StatsContentCardGroupTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsContentCardGroupTrackingParams
    }
  }
`);

export const StatsContentCardGroupFragment = gql(/* GraphQL */ `
  fragment StatsContentCardGroupTrackingParams on StatsContentCardGroup {
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

export async function getStatsContentCardGroup(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "StatsContentCardGroup",
    urn,
  });

  let cachedData: StatsContentCardGroupTrackingParamsFragment | null = cache.readFragment({
    fragment: StatsContentCardGroupFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, StatsContentCardGroupTrackingQuery);

    const card = data?.Cards?.[0];
    const isStatsContentCardGroup = card && "__typename" in card;
    const statsContentCardGroup = isStatsContentCardGroup ? card : undefined;

    if (statsContentCardGroup) {
      cache.writeFragment({
        fragment: StatsContentCardGroupFragment,
        id,
        data: statsContentCardGroup,
      });

      cachedData = statsContentCardGroup;
    }
  }

  return cachedData;
}
