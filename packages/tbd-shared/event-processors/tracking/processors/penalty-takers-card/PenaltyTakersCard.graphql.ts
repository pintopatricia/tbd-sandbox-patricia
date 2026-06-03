import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { PenaltyTakersCardTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const PenaltyTakersCardTrackingQuery = gql(/* GraphQL */ `
  query PenaltyTakersCardTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...PenaltyTakersCardTrackingParams
    }
  }
`);

export const PenaltyTakersCardFragment = gql(/* GraphQL */ `
  fragment PenaltyTakersCardTrackingParams on PenaltyTakersCard {
    __typename
    urn
    event {
      urn
      name
    }
    penaltyTakers {
      player {
        ... on FootballPlayerFixtureContext {
          __typename
          urn
          player {
            id
            name
          }
        }
      }
    }
  }
`);

export async function getPenaltyTakersCard(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "PenaltyTakersCard",
    urn,
  });

  let cachedData = cache.readFragment({
    fragment: PenaltyTakersCardFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, PenaltyTakersCardTrackingQuery);

    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is PenaltyTakersCardTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: PenaltyTakersCardFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
