import { ObbSquadVsSquadCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "../../entities/obb-football-player/obb-football-player-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import { NormalizedObbSquadVsSquadCard } from "./ObbSquadVsSquadCard.types";

const normalizeObbSquadVsSquadCardFragmentIntoObbSquadVsSquadCard = (
  obbSquadVsSquadCard: ObbSquadVsSquadCardFragment,
): TransformedFragment<NormalizedObbSquadVsSquadCard> => {
  const {
    __typename,
    urn,
    title,
    outcomesText,
    event,
    eventParticipants,
    firstSquadParticipants,
    secondSquadParticipants,
    defaultLegs,
    incidentType,
    statsText,
    showModalEntryPoint,
    participantInfo,
    filterTags,
  } = obbSquadVsSquadCard;

  return {
    data: {
      typename: __typename,
      urn,
      title: normalizeDisplayNameFragmentIntoDisplayName(title),
      outcomesLabel: outcomesText ? normalizeDisplayNameFragmentIntoDisplayName(outcomesText) : undefined,
      statsLabel: statsText ? normalizeDisplayNameFragmentIntoDisplayName(statsText) : undefined,
      showModalEntryPoint,
      participantInfo: participantInfo ? normalizeDisplayNameFragmentIntoDisplayName(participantInfo) : undefined,
      filterTags: filterTags.map((filterTag) => ({
        type: filterTag.type,
        label: filterTag.label ? normalizeDisplayNameFragmentIntoDisplayName(filterTag.label) : undefined,
      })),
      sportevent: {
        typename: event.__typename,
        urn: event.urn,
        name: event.name,
        eventId: event.eventId,
      },
      firstSquadParticipants: firstSquadParticipants.map(
        ({ urn: participantUrn, __typename: participantsTypename }) => ({
          urn: participantUrn,
          typename: participantsTypename,
        }),
      ),
      secondSquadParticipants: secondSquadParticipants.map(
        ({ urn: participantUrn, __typename: participantsTypename }) => ({
          urn: participantUrn,
          typename: participantsTypename,
        }),
      ),
      eventParticipants: eventParticipants.map(
        (footballPlayer) => normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(footballPlayer).data,
      ),
      incidentType: incidentType.id,
      defaultLegs: defaultLegs.map((leg) => normalizeObbLegFragmentIntoObbLeg(leg).data),
    },
  };
};

export default normalizeObbSquadVsSquadCardFragmentIntoObbSquadVsSquadCard;
