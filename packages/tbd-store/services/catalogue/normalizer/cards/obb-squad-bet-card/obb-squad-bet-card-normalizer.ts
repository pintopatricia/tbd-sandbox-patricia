import { ObbSquadBetCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "../../entities/obb-football-player/obb-football-player-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import { NormalizedObbSquadBetCard } from "./ObbSquadBetCard.types";

const normalizeObbSquadBetCardFragmentIntoObbSquadBetCard = (
  obbSquadBetCard: ObbSquadBetCardFragment,
): TransformedFragment<NormalizedObbSquadBetCard> => {
  const {
    __typename,
    urn,
    title,
    outcomesLabel,
    event,
    eventParticipants,
    squadParticipants,
    defaultLegs,
    incidentType,
    statsLabel,
    defaultOutcomeIndex,
    showModalEntryPoint,
    entryPointLabel,
    participantInfo,
    filterTags,
  } = obbSquadBetCard;

  return {
    data: {
      typename: __typename,
      urn,
      title: normalizeDisplayNameFragmentIntoDisplayName(title),
      outcomesLabel: normalizeDisplayNameFragmentIntoDisplayName(outcomesLabel),
      statsLabel: normalizeDisplayNameFragmentIntoDisplayName(statsLabel),
      showModalEntryPoint,
      entryPointLabel: entryPointLabel ? normalizeDisplayNameFragmentIntoDisplayName(entryPointLabel) : undefined,
      participantInfo: participantInfo ? normalizeDisplayNameFragmentIntoDisplayName(participantInfo) : undefined,
      filterTags: filterTags?.map((filterTag) => ({
        type: filterTag.type,
        label: filterTag.label ? normalizeDisplayNameFragmentIntoDisplayName(filterTag.label) : undefined,
      })),
      sportevent: {
        typename: event.__typename,
        urn: event.urn,
        name: event.name,
        eventId: event.eventId,
      },
      squadParticipants: squadParticipants.map(({ urn: participantUrn, __typename: participantsTypename }) => ({
        urn: participantUrn,
        typename: participantsTypename,
      })),
      eventParticipants: eventParticipants.map(
        (footballPlayer) => normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(footballPlayer).data,
      ),
      incidentType: incidentType.id,
      defaultLegs: defaultLegs.map((leg) => normalizeObbLegFragmentIntoObbLeg(leg).data),
      defaultOutcomeIndex,
    },
  };
};

export default normalizeObbSquadBetCardFragmentIntoObbSquadBetCard;
