import { ObbPvpCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "../../entities/obb-football-player/obb-football-player-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import { NormalizedObbPvpCard } from "./ObbPvpCard.types";

const normalizeObbPvpCardFragmentIntoObbPvpCard = (
  obbPvpCard: ObbPvpCardFragment,
): TransformedFragment<NormalizedObbPvpCard> => {
  const { __typename, urn, title, event, participantInfo, participants, incidentType, defaultLegs, teams, filterTags } =
    obbPvpCard;

  return {
    data: {
      typename: __typename,
      urn,
      title: title.name,
      sportevent: {
        typename: event.__typename,
        urn: event.urn,
        name: event.name,
        eventId: event.eventId,
      },
      teams: {
        home: {
          id: teams.home.id,
          name: teams.home.name,
          color: (teams.home.jerseys && teams.home.jerseys[0]?.color) || null,
        },
        away: {
          id: teams.away.id,
          name: teams.away.name,
          color: (teams.away.jerseys && teams.away.jerseys[0]?.color) || null,
        },
      },

      participants: participants.map(
        (footballPlayer) => normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(footballPlayer).data,
      ),
      incidentType: incidentType.id,
      participantInfo: participantInfo ? { name: "name" in participantInfo ? participantInfo.name : "" } : undefined,
      filterTags: filterTags?.map((filterTag) => ({
        type: filterTag.type,
        label: filterTag.label ? normalizeDisplayNameFragmentIntoDisplayName(filterTag.label) : undefined,
      })),
      defaultLegs: defaultLegs.map((leg) => normalizeObbLegFragmentIntoObbLeg(leg).data),
    },
  };
};

export default normalizeObbPvpCardFragmentIntoObbPvpCard;
