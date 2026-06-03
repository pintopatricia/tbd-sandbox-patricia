import { useFootballPlayerCompetitionStatsCardQuery } from "../model/FootballPlayerCompetitionStatsCard.graphql";

export default function useFootballPlayerCompetitionStatsCardVM(urn: string, visible: boolean) {
  const { called, loading, data } = useFootballPlayerCompetitionStatsCardQuery(urn, { visible });

  const { seasonStats } = data?.card.player || {};

  if (!seasonStats) {
    return {
      loading,
      called,
      vm: {
        data: null,
      },
    };
  }

  const totalCards = (seasonStats?.totals?.yellowCards || 0) + (seasonStats?.totals?.redCards || 0);

  const vmData = {
    data: {
      stats: {
        totalGoals: seasonStats?.totals?.goals || 0,
        totalAssists: seasonStats?.totals?.assists || 0,
        totalCards,
      },
    },
  };

  return {
    loading,
    called,
    vm: vmData,
  };
}
