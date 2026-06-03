import { gql } from "../../../../types/__generated__";
import { fetchApolloQuery } from "../fetch-apollo-query";
import type { NotificationsSubscriptionRaceTrackingParamsFragment } from "../../../../types/__generated__/graphql";

export const NotificationsSubscriptionRaceTrackingFragment = gql(/* GraphQL */ `
  fragment NotificationsSubscriptionRaceTrackingParams on Race {
    __typename
    urn
    raceId
    name
    startTime
    meeting {
      urn
      venue
      sport {
        name
      }
    }
  }
`);

const NotificationsSubscriptionRaceTrackingQuery = gql(/* GraphQL */ `
  query NotificationsSubscriptionRaceTracking($urn: [URN!]!) {
    Races(URNs: $urn) {
      ...NotificationsSubscriptionRaceTrackingParams
    }
  }
`);

export async function getRaceTrackingData(
  raceUrn: string,
): Promise<NotificationsSubscriptionRaceTrackingParamsFragment | null> {
  const data = await fetchApolloQuery(raceUrn, NotificationsSubscriptionRaceTrackingQuery);
  return data?.Races?.[0] ?? null;
}
