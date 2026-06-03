import { getApolloClient } from "../../../apollo-client/client";
import {
  StatsMatchStatsCardFragment,
  StatsSupportingContentButtonsCardGroupQuery,
  IncidentsCardFragment,
  StatsBroadcastsCardFragment,
  StatsRaceResultsCardFragment,
} from "../../../types/__generated__/graphql";
import { IncidentsCardQuery } from "@ppb/tbd-components-rich-data/components/IncidentsCard/model/IncidentsCard.graphql";
import { StatsMatchStatsCardQuery } from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/model/StatsMatchStatsCard.graphql";
import { StatsBroadcastsCardQuery } from "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/model/StatsBroadcastsCard.graphql";
import { StatsRaceResultsCardQuery } from "../../StatsRaceResultsCard/model/StatsRaceResultsCard.graphql";

const { cache } = getApolloClient();

export function hydrateItemCards(data: StatsSupportingContentButtonsCardGroupQuery) {
  const card = data.Cards?.[0];
  const isStatsSupportingContentButtonsCardGroup =
    card && "__typename" in card && card.__typename === "StatsSupportingContentButtonsCardGroup";
  const statsSupportingContentButtonsCardGroup = isStatsSupportingContentButtonsCardGroup ? card : undefined;

  if (statsSupportingContentButtonsCardGroup) {
    statsSupportingContentButtonsCardGroup.full.edges.forEach((edge) => {
      const node = edge?.node;

      if (node && "__typename" in node) {
        switch (node.__typename) {
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
          case "StatsBroadcastsCard":
            cache.writeQuery({
              query: StatsBroadcastsCardQuery,
              data: {
                Cards: [node satisfies StatsBroadcastsCardFragment],
              },
              variables: {
                urn: node.urn,
              },
            });
            break;
          case "StatsRaceResultsCard":
            cache.writeQuery({
              query: StatsRaceResultsCardQuery,
              data: {
                Cards: [node satisfies StatsRaceResultsCardFragment],
              },
              variables: {
                urn: node.urn,
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
