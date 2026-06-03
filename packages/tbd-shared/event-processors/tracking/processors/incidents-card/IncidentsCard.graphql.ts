import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { IncidentsCardTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const IncidentsCardTrackingQuery = gql(/* GraphQL */ `
  query IncidentsCardTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...IncidentsCardTrackingParams
    }
  }
`);

export const IncidentsCardFragment = gql(/* GraphQL */ `
  fragment IncidentsCardTrackingParams on IncidentsCard {
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

export async function getIncidentsCard(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "IncidentsCard",
    urn,
  });

  let cachedData: IncidentsCardTrackingParamsFragment | null = cache.readFragment({
    fragment: IncidentsCardFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, IncidentsCardTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is IncidentsCardTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: IncidentsCardFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
