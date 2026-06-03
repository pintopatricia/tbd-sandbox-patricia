import { ObbParticipants } from "../../obb-participants/ObbParticipants.types";
import {
  ObbLeg,
  ObbPvpLegTemplateParams,
  ObbSquadBetLegTemplateParams,
  ObbSquadVsSquadTemplateParams,
  SelectorObbLeg,
  SelectorObbLegTemplateParams,
} from "../ObbLegs.types";

const buildTemplateParams = (
  templateParams: ObbLeg["templateParams"],
  participants: ObbParticipants,
  templateId: ObbLeg["templateId"],
): SelectorObbLegTemplateParams | undefined => {
  if (!templateParams) {
    return undefined;
  }

  if (templateId === "playerVsPlayer") {
    const { participantIdA, participantIdB, outcomeId, timePeriodId } = templateParams as ObbPvpLegTemplateParams;

    return {
      participantIdA: participants[participantIdA],
      participantIdB: participants[participantIdB],
      outcomeId,
      timePeriodId,
    };
  }

  if (templateId === "participantsCombined") {
    const {
      participantIds: squadBetParticipants,
      outcomeIds,
      value,
      timePeriodId,
      quantifier,
    } = templateParams as ObbSquadBetLegTemplateParams;

    return {
      participantIds: squadBetParticipants.map((participant) => participants[participant]),
      outcomeIds,
      value,
      timePeriodId,
      quantifier,
    };
  }

  if (templateId === "squadVsSquad") {
    const { squadAParticipantIds, squadBParticipantIds, outcomeIds, timePeriodId, quantifier } =
      templateParams as ObbSquadVsSquadTemplateParams;

    return {
      squadAParticipantIds: squadAParticipantIds.map((participant) => participants[participant]),
      squadBParticipantIds: squadBParticipantIds.map((participant) => participants[participant]),
      outcomeIds,
      timePeriodId,
      quantifier,
    };
  }

  return undefined;
};

export const buildObbLegSelector = (obbLeg: ObbLeg, participants: ObbParticipants): SelectorObbLeg => ({
  id: obbLeg.id,
  templateId: obbLeg.templateId,
  templateParams: buildTemplateParams(obbLeg.templateParams, participants, obbLeg.templateId),
  quote: obbLeg.quote,
  event: obbLeg.event,
});
