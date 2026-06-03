import { StatsFormCardQuery } from "@ppb/tbd-components-rich-data/components/StatsFormCard/model/StatsFormCard.graphql";
import { StatsTeamsQuery } from "@ppb/tbd-components-rich-data/components/StatsTeamsCard/model/StatsTeamsCard.graphql";
import { StatsHeadToHeadQuery } from "@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/model/StatsHeadToHeadCard.graphql";
import { getApolloClient } from "../../../apollo-client/client";
import {
  StatsFormCardCompetitionFormFragment,
  StatsFormCardRecentFormFragment,
  StatsGoalsAndShotsCardFragment,
  StatsHeadToHeadCardFragment,
  StatsMatchStatsCardFragment,
  StatsTeamsCardPreviousFiveFragment,
  StatsPebbleCardGroupQuery,
  StatsTeamsCardAllSeasonFragment,
  IncidentsCardFragment,
} from "../../../types/__generated__/graphql";
import { IncidentsCardQuery } from "@ppb/tbd-components-rich-data/components/IncidentsCard/model/IncidentsCard.graphql";
import { StatsGoalsAndShotsCardQuery } from "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/model/StatsGoalsAndShotsCard.graphql";
import { StatsMatchStatsCardQuery } from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/model/StatsMatchStatsCard.graphql";
import { StatsPlayersSeasonStatsQuery } from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/model/StatsPlayersSeasonStatsCard.graphql";
import {
  StatsPlayersSeasonStatsCardAttackingFragment,
  StatsPlayersSeasonStatsCardDefendingFragment,
} from "@ppb/tbd-components-rich-data/types/__generated__/graphql";

const { cache } = getApolloClient();

export function hydrateItemCards(data: StatsPebbleCardGroupQuery) {
  const card = data.Cards?.[0];
  const isStatsPebbleCardGroup = card && "__typename" in card && card.__typename === "StatsPebbleCardGroup";
  const statsPebbleCardGroup = isStatsPebbleCardGroup ? card : undefined;

  if (statsPebbleCardGroup) {
    statsPebbleCardGroup.full.edges.forEach((edge) => {
      const node = edge?.node;

      if (node && "__typename" in node) {
        switch (node.__typename) {
          case "StatsFormCard":
            cache.writeQuery({
              query: StatsFormCardQuery,
              data: {
                Cards: [node satisfies StatsFormCardRecentFormFragment | StatsFormCardCompetitionFormFragment],
              },
              variables: {
                urn: node.urn,
                isRecent: true,
                isCompetition: true,
              },
            });
            break;
          case "StatsHeadToHeadCard":
            cache.writeQuery({
              query: StatsHeadToHeadQuery,
              data: {
                Cards: [node satisfies StatsHeadToHeadCardFragment],
              },
              variables: {
                urn: node.urn,
              },
            });
            break;
          case "StatsTeamsCard":
            cache.writeQuery({
              query: StatsTeamsQuery,
              data: {
                Cards: [node satisfies StatsTeamsCardPreviousFiveFragment | StatsTeamsCardAllSeasonFragment],
              },
              variables: {
                urn: node.urn,
                isPreviousFive: true,
                isAllSeason: true,
              },
            });
            break;
          case "StatsPlayersSeasonStatsCard":
            cache.writeQuery({
              query: StatsPlayersSeasonStatsQuery,
              data: {
                Cards: [
                  node satisfies
                    | StatsPlayersSeasonStatsCardAttackingFragment
                    | StatsPlayersSeasonStatsCardDefendingFragment,
                ],
              },
              variables: {
                urn: node.urn,
                isAttacking: true,
              },
            });
            break;
          case "StatsMatchStatsCard":
            cache.writeQuery({
              query: StatsMatchStatsCardQuery,
              data: {
                Cards: [node satisfies StatsMatchStatsCardFragment],
              },
              variables: {
                urn: node.urn,
              },
            });
            break;
          case "StatsGoalsAndShotsCard":
            cache.writeQuery({
              query: StatsGoalsAndShotsCardQuery,
              data: {
                Cards: [node satisfies StatsGoalsAndShotsCardFragment],
              },
              variables: {
                urn: node.urn,
              },
            });
            break;
          case "IncidentsCard":
            cache.writeQuery({
              query: IncidentsCardQuery,
              data: {
                Cards: [node satisfies IncidentsCardFragment],
              },
              variables: {
                urn: [node.urn],
              },
            });
            break;
          default:
        }

        return true;
      }

      return false;
    });
  }

  return false;
}
