import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { gql } from "../../../types/__generated__";
import { getApolloClient } from "../../../apollo-client/client";

export const StatsPlayersInPlayUserDetailsFragment = gql(/* GraphQL */ `
  fragment StatsPlayersInPlayUserDetails on AppContextDetails {
    __typename
    urn
    userdetails {
      localeCodeBcp47
      jurisdiction {
        jurisdiction
      }
      timezone
    }
  }
`);

export const StatsPlayersInPlayCardFragment = gql(/* GraphQL */ `
  fragment StatsPlayersInPlayCard on StatsPlayersInPlayCard {
    __typename
    urn
    fixture {
      urn
      players {
        id
        name
        stats {
          stats {
            totalShots
            shotsOnTarget
            foulsWon
            assists
            fouls
            tacklesWon
            blockedShots
            offsides
            interceptions
            goalkeeperSaves
            shotsCreated
          }
        }
      }
      home {
        name
        squad {
          players {
            id
          }
        }
      }
      away {
        name
        squad {
          players {
            id
          }
        }
      }
    }
    footballPlayerViewLinks {
      viewUrl
      viewUrn
      footballPlayer {
        urn
      }
    }
  }
`);

export const StatsPlayersInPlayUserDetailsQuery = gql(/* GraphQL */ `
  query StatsPlayersInPlayUserDetails {
    AppContext {
      ...StatsPlayersInPlayUserDetails
    }
  }
`);

export const StatsPlayersInPlayCardQuery = gql(/* GraphQL */ `
  query StatsPlayersInPlayCard($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsPlayersInPlayCard
    }
  }
`);

export const StatsPlayersInPlayCardThrotlesFragment = gql(/* GraphQL */ `
  fragment StatsPlayersInPlayCardThrotles on AppContextDetails {
    __typename
    throttles {
      name
      isActive
    }
  }
`);

export function getStatsPlayerInPlayThrottle() {
  const { cache } = getApolloClient();

  const id = cache.identify({
    __typename: "AppContextDetails",
    urn: "ppb:tbd:appContext:appContext",
  });

  const { throttles } =
    cache.readFragment({
      fragment: StatsPlayersInPlayCardThrotlesFragment,
      id,
    }) || {};

  return throttles?.find(({ name }) => name === "SCA_SHOTS_CREATED")?.isActive;
}

export const useStatsPlayersInPlayUserDetailsQuery = (options: { visible: boolean }) => {
  const [fetchAppContext, { data, loading, called }] = useLazyQuery(StatsPlayersInPlayUserDetailsQuery);

  useEffect(() => {
    if (options.visible) {
      fetchAppContext();
    }
  }, [options.visible, fetchAppContext]);

  return {
    loading: !called || loading,
    data: {
      appContext: data?.AppContext,
    },
  };
};

export const useStatsPlayersInPlayCardQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const [fetchCard, { called, loading, data }] = useLazyQuery(StatsPlayersInPlayCardQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!called && options.visible && !data) {
      fetchCard({
        variables: {
          urn: variables.cardURN,
        },
      });
    }
  }, [called, options.visible, data, fetchCard, variables.cardURN]);

  const card = data?.Cards?.[0];
  const isStatsPlayersInPlayCard = card && "__typename" in card;
  const statsPlayersInPlayCard = isStatsPlayersInPlayCard ? card : undefined;

  return {
    loading: !called || loading,
    data: {
      card: statsPlayersInPlayCard,
    },
  };
};
