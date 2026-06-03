import { ObbFootballPlayerFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { NormalizedObbFootballPlayer } from "./ObbFootballPlayer.types";

const normalizeObbFootballPlayerFragmentIntoObbFootballPlayer = (
  obbFootballPlayer: ObbFootballPlayerFragment,
): TransformedFragment<NormalizedObbFootballPlayer> => {
  const { urn: participantUrn, player, team, __typename: participantsTypename } = obbFootballPlayer;

  return {
    data: {
      urn: participantUrn,
      typename: participantsTypename,
      player: {
        id: player.id,
        name: player.name,
        position: player.position,
        shirtNumber: player.shirtNumber,
        seasonStats: player.seasonStats
          ? {
              matchesPlayed: player.seasonStats.matchesPlayed,
              averages: {
                goals: player.seasonStats.averages.goals,
                totalShots: player.seasonStats.averages.totalShots,
                shotsOnTarget: player.seasonStats.averages.shotsOnTarget,
                yellowRedCards: player.seasonStats.averages.yellowRedCards,
                redCards: player.seasonStats.averages.redCards,
                yellowCards: player.seasonStats.averages.yellowCards,
                fouls: player.seasonStats.averages.fouls,
                foulsWon: player.seasonStats.averages.foulsWon,
                assists: player.seasonStats.averages.assists,
                passes: player.seasonStats.averages.passes,
                foulInvolvements: player.seasonStats.averages.foulInvolvements,
              },
            }
          : null,
      },
      team: {
        id: team.id,
        name: team.name,
        color: team.color,
        jerseys: team.jerseys?.map((jersey) => ({
          url: jersey?.url || null,
        })),
      },
      incidentTypes: {},
    },
  };
};

export default normalizeObbFootballPlayerFragmentIntoObbFootballPlayer;
