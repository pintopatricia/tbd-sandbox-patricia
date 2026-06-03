import { ObbParticipants } from "../../../../entities/obb-participants/ObbParticipants.types";
import { ObbPvpCard, SelectorObbPvpCard } from "../ObbCard.types";

export function buildObbPvpCard(obbCard: ObbPvpCard, participants: ObbParticipants): SelectorObbPvpCard {
  return {
    urn: obbCard.urn,
    typename: obbCard.typename,
    title: obbCard.title,
    sportevent: obbCard.sportevent,
    participantInfo: obbCard.participantInfo,
    filterTags: obbCard.filterTags,
    incidentType: obbCard.incidentType,
    teams: obbCard.teams,
    participants: obbCard.participants.map((participant) => {
      const participantData = participants[participant];
      const homeTeam = obbCard.teams?.home;
      const awayTeam = obbCard.teams?.away;

      return {
        ...participantData,
        team: participantData.team && {
          ...participantData.team,
          color: participantData.team.id === homeTeam?.id ? homeTeam?.color : awayTeam?.color,
        },
      };
    }),
    selectedLegs: obbCard.selectedLegs,
    legs: obbCard.legs,
  };
}
