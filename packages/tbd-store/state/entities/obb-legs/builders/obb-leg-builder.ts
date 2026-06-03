import { NormalizedObbLeg } from "../../../../services/catalogue/normalizer/entities/obb-leg/ObbLeg.types";
import {
  NormalizedObbPvpTemplateParams,
  NormalizeObbSquadBetTemplateParams,
  NormalizeObbSquadVsSquadTemplateParams,
} from "../../../../services/catalogue/normalizer/entities/obb-template-params/ObbTemplateParams.types";
import { ObbLeg, ObbTemplateParams } from "../ObbLegs.types";

const buildTemplateParams = (
  templateParams: NormalizedObbLeg["templateParams"],
  templateId: NormalizedObbLeg["templateId"],
): ObbTemplateParams | null => {
  if (!templateParams) {
    return null;
  }

  if (templateId === "playerVsPlayer") {
    const { participantIdA, participantIdB, outcomeId, timePeriodId } =
      templateParams as NormalizedObbPvpTemplateParams;

    return {
      participantIdA: participantIdA.urn,
      participantIdB: participantIdB.urn,
      outcomeId,
      timePeriodId,
    };
  }
  if (templateId === "participantsCombined") {
    const { participantIds, outcomeIds, value, timePeriodId, quantifier } =
      templateParams as NormalizeObbSquadBetTemplateParams;
    return {
      participantIds: participantIds.map((participant) => participant.urn),
      outcomeIds,
      value,
      timePeriodId,
      quantifier,
    };
  }

  if (templateId === "squadVsSquad") {
    const { squadAParticipantIds, squadBParticipantIds, outcomeIds, quantifier, timePeriodId } =
      templateParams as NormalizeObbSquadVsSquadTemplateParams;

    return {
      squadAParticipantIds: squadAParticipantIds.map((participant) => participant.urn),
      squadBParticipantIds: squadBParticipantIds.map((participant) => participant.urn),
      outcomeIds,
      quantifier,
      timePeriodId,
    };
  }

  return null;
};

export const buildObbLeg = (obbLeg: NormalizedObbLeg): ObbLeg => {
  const { id, templateId, templateParams, quote, event } = obbLeg;

  return {
    id,
    templateId,
    templateParams: buildTemplateParams(templateParams, templateId),
    quote,
    event,
  };
};
