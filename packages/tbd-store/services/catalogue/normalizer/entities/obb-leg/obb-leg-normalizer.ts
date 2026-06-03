import { ObbLegFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeObbQuoteFragmentIntoObbQuote from "../../cards/obb-quotes/obb-quotes-normalizer";
import { hashObjectFnv1a } from "../../../../../helpers/hashing";
import { omitTypename } from "../../../../../helpers/obb";
import { NormalizedObbLeg } from "./ObbLeg.types";
import normalizeObbTemplateParamsFragmentIntoObbTemplateParams from "../obb-template-params/obb-template-params-normalizer";
import { ObbLegTemplateId } from "../../../../../state/entities/obb-legs/ObbLegs.types";

const normalizeObbLegFragmentIntoObbLeg = (obbLeg: ObbLegFragment): TransformedFragment<NormalizedObbLeg> => {
  const { event, quote, templateId, templateParams } = obbLeg;

  const normalizedEvent = {
    // eslint-disable-next-line no-underscore-dangle
    typename: event.__typename,
    urn: event.urn,
    name: event.name,
    eventId: event.eventId,
  };

  let normalizedTemplateParams;
  // eslint-disable-next-line no-underscore-dangle
  switch (templateParams.__typename) {
    case "ObbPvpParams":
      normalizedTemplateParams = {
        ...omitTypename(templateParams),
        participantIdA: templateParams.participantIdA.urn,
        participantIdB: templateParams.participantIdB.urn,
      };
      break;
    case "ObbSquadBetParams":
      normalizedTemplateParams = {
        ...omitTypename(templateParams),
        participantIds: templateParams.participantIds.map((participant) => participant.urn),
        outcomeIds: templateParams.outcomeIds,
        value: templateParams.value,
        timePeriodId: templateParams.timePeriodId,
        quantifier: templateParams.quantifier,
      };
      break;
    case "ObbSquadVsSquadParams":
      normalizedTemplateParams = {
        ...omitTypename(templateParams),
        squadAParticipantIds: templateParams.squadAParticipantIds.map((participant) => participant.urn),
        squadBParticipantIds: templateParams.squadBParticipantIds.map((participant) => participant.urn),
        outcomeIds: templateParams.outcomeIds,
        timePeriodId: templateParams.timePeriodId,
        quantifier: templateParams.quantifier,
      };
      break;
    default:
      throw new Error("Unknown template params type");
  }

  const id = hashObjectFnv1a({
    event: normalizedEvent,
    templateId,
    templateParams: normalizedTemplateParams,
  });

  return {
    data: {
      event: normalizedEvent,
      quote: normalizeObbQuoteFragmentIntoObbQuote(quote),
      templateParams: normalizeObbTemplateParamsFragmentIntoObbTemplateParams(templateParams) ?? undefined,
      templateId: templateId as ObbLegTemplateId,
      id,
    },
  };
};

export default normalizeObbLegFragmentIntoObbLeg;
