import { useQuery } from "@apollo/client/react";
import { gql } from "../../../types/__generated__";

export const SkyBetClubTrackerUserDetailsFragment = gql(/* GraphQL */ `
  fragment SkyBetClubTrackerUserDetails on AppContextDetails {
    __typename
    urn
    userdetails {
      localeCodeBcp47
      currencyCode
      jurisdiction {
        jurisdiction
      }
    }
    brandSettings {
      name
      isActive
    }
  }
`);

export const SkyBetClubTrackerCardFragment = gql(/* GraphQL */ `
  fragment SkyBetClubTrackerCard on SkyBetClubTrackerCard {
    __typename
    urn
    promotion {
      ... on PphPromotion {
        fulfillmentEndDate
        customerPromotionState {
          criteriaState {
            params {
              gauge {
                current
                target
              }
            }
          }
          hasAccepted
        }
        termsAndConditions {
          summarized
        }
      }
    }
  }
`);

export const SkyBetClubTrackerUserDetailsQuery = gql(/* GraphQL */ `
  query SkyBetClubTrackerUserDetails {
    AppContext {
      ...SkyBetClubTrackerUserDetails
    }
  }
`);

export const SkyBetClubTrackerQuery = gql(/* GraphQL */ `
  query SkyBetClubTrackerCard($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...SkyBetClubTrackerCard
    }
  }
`);

export const useSkyBetClubTrackerUserDetailsQuery = () => {
  const { loading, data } = useQuery(SkyBetClubTrackerUserDetailsQuery);

  return {
    loading,
    data: {
      appContext: data?.AppContext,
    },
  };
};

export const useSkyBetClubTrackerQuery = () => {
  const cardURN = "ppb:tbd:card:skyBetClubTracker:skyBetClubTracker";

  const { loading, data } = useQuery(SkyBetClubTrackerQuery, {
    fetchPolicy: "network-only",
    variables: {
      urn: cardURN,
    },
  });

  const card = data?.Cards?.[0];
  const isSkyBetClubTrackerCard = card && "__typename" in card;
  const skyBetClubTrackerCard = isSkyBetClubTrackerCard ? card : undefined;

  return {
    loading,
    data: {
      card: skyBetClubTrackerCard,
    },
  };
};
