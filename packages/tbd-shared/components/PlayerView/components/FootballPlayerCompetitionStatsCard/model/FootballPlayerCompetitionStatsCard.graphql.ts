import { useLazyQuery } from "@apollo/client/react";
import { gql } from "../../../../../types/__generated__";
import { FootballPlayerCompetitionStatsCard } from "../../../../../types/__generated__/graphql";
import { useEffect } from "react";

export const FootballPlayerCompetitionStatsCardFragment = gql(/* GraphQL */ `
  fragment footballPlayerCompetitionStatsCard on FootballPlayerCompetitionStatsCard {
    __typename
    urn
    player {
      seasonStats {
        matchesPlayed
        totals {
          goals
          yellowCards
          redCards
          assists
        }
      }
    }
  }
`);

export const FootballPlayerCompetitionStatsCardQuery = gql(/* GraphQL */ `
  query FootballPlayerCompetitionStatsCard($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...footballPlayerCompetitionStatsCard
    }
  }
`);

export const isFootballPlayerCompetitionStatsCard = (card: unknown): card is FootballPlayerCompetitionStatsCard => {
  return (
    !!card &&
    typeof card === "object" &&
    "urn" in card &&
    "__typename" in card &&
    card.__typename === "FootballPlayerCompetitionStatsCard"
  );
};

export const useFootballPlayerCompetitionStatsCardQuery = (urn: string, options: { visible: boolean }) => {
  const [fetchCard, { called, loading, data }] = useLazyQuery(FootballPlayerCompetitionStatsCardQuery);

  useEffect(() => {
    if (options.visible) {
      fetchCard({
        variables: {
          urn,
        },
      });
    }
  }, [options.visible, fetchCard, urn]);

  const card = data?.Cards?.[0];
  if (isFootballPlayerCompetitionStatsCard(card)) {
    return {
      loading: !called || loading,
      called,
      data: {
        card,
      },
    };
  }

  return {
    loading,
    called,
    vm: {
      data: null,
    },
  };
};
