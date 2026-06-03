import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { gql } from "../../../types/__generated__";

export const StatsRaceResultsCardFragment = gql(/* GraphQL */ `
  fragment StatsRaceResultsCard on StatsRaceResultsCard {
    __typename
    urn
    raceResultsRunners: runners {
      horse {
        name
        performance {
          positionOfficial
          positionStatusCode
        }
      }
      details {
        saddleCloth
        silk
      }
      isBetSelection
    }
  }
`);

export const StatsRaceResultsCardQuery = gql(/* GraphQL */ `
  query StatsRaceResultsCard($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...StatsRaceResultsCard
    }
  }
`);

export const useStatsRaceResultsCardQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const [fetchCardGroup, { called, loading, data }] = useLazyQuery(StatsRaceResultsCardQuery);

  const card = data?.Cards?.[0];
  const isStatsRaceResultsCard = card && "__typename" in card;
  const statsRaceResultsCard = isStatsRaceResultsCard ? card : undefined;

  useEffect(() => {
    if (options.visible) {
      fetchCardGroup({
        variables: {
          urn: variables.cardURN,
        },
      });
    }
  }, [options.visible, fetchCardGroup, variables.cardURN]);

  return {
    loading: !called || loading,
    data: {
      card: statsRaceResultsCard,
    },
  };
};
