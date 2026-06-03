import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";
import { fetchApolloQuery } from "../fetch-apollo-query";
import { LottoCardTrackingParamsFragment } from "../../../../types/__generated__/graphql";

const LottoCardTrackingQuery = gql(/* GraphQL */ `
  query LottoCardTracking($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...LottoCardTrackingParams
    }
  }
`);

export const LottoCardFragment = gql(/* GraphQL */ `
  fragment LottoCardTrackingParams on LottoCard {
    __typename
    urn
    shouldShowCompetitionName
    competition {
      __typename
      competitionId
      urn
      name
    }
    lottoMarkets: markets {
      __typename
      urn
      name
      marketType
      liveData {
        urn
        sportsbookMarketStatus
      }
      hierarchy {
        ... on EventCompetitionHierarchy {
          sportevent {
            eventId
            __typename
            urn
            name
            openDate
          }
          competition {
            urn
            __typename
          }
        }
      }
      runners {
        runnerURN
        selectionId
        name
        resultType
      }
    }
    marketIds
  }
`);

export async function getLottoCard(urn: string) {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "LottoCard",
    urn,
  });

  let cachedData: LottoCardTrackingParamsFragment | null = cache.readFragment({
    fragment: LottoCardFragment,
    id,
  });

  if (!cachedData) {
    const data = await fetchApolloQuery(urn, LottoCardTrackingQuery);
    if (data?.Cards) {
      const newCardData =
        data.Cards.find(
          (card): card is LottoCardTrackingParamsFragment => !!card && "urn" in card && card.urn === urn,
        ) || null;

      cache.writeFragment({
        fragment: LottoCardFragment,
        id,
        data: newCardData,
      });

      cachedData = newCardData;
    }
  }

  return cachedData;
}
