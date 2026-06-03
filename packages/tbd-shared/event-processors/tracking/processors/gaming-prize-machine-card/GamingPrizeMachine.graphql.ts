import { gql } from "../../../../types/__generated__";
import { getApolloClient } from "../../../../apollo-client/client";

export const GamingPrizeMachineCardFragment = gql(/* GraphQL */ `
  fragment GamingPrizeMachineCardTrackingParams on GamingPrizeMachineCard {
    __typename
    urn
    placementId
    completed
    jackpotAmount
    jackpotState
    activeTitle
    ctaLabel
    displayJackpotWinnersPostPlayWidget
    guaranteedPrize
  }
`);

export const GamingPrizeMachineCardThrotlesFragment = gql(/* GraphQL */ `
  fragment GamingPrizeMachineCardThrotles on AppContextDetails {
    __typename
    throttles {
      name
      isActive
    }
  }
`);

export function getGamingPrizeMachineCard(urn: string) {
  const apolloClient = getApolloClient();

  const card = apolloClient.readFragment({
    fragment: GamingPrizeMachineCardFragment,
    id: urn,
  });

  return card;
}

export function getGAThrottles() {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "AppContextDetails",
    urn: "ppb:tbd:appContext:appContext",
  });

  const { throttles } =
    cache.readFragment({
      fragment: GamingPrizeMachineCardThrotlesFragment,
      id,
    }) || {};

  const UAEnabled = !throttles?.find(({ name }) => name === "DISABLE_UA")?.isActive;
  const GA4Enabled = throttles?.find(({ name }) => name === "ENABLE_GA4")?.isActive;

  return {
    UAEnabled,
    GA4Enabled,
  };
}
