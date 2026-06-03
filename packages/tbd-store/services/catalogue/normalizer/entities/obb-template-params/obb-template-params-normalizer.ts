import {
  ObbPvpTemplateParamsFragment,
  ObbSquadBetTemplateParamsFragment,
  ObbSquadVsSquadTemplateParamsFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { NormalizedObbTemplateParams } from "./ObbTemplateParams.types";

const normalizeObbTemplateParamsFragmentIntoObbTemplateParams = (
  obbTemplateParams:
    | ObbPvpTemplateParamsFragment
    | ObbSquadBetTemplateParamsFragment
    | ObbSquadVsSquadTemplateParamsFragment,
): NormalizedObbTemplateParams | null => {
  // eslint-disable-next-line no-underscore-dangle
  if (obbTemplateParams.__typename === "ObbPvpParams") {
    const { participantIdA, participantIdB, outcomeId, timePeriodId } = obbTemplateParams;

    return {
      // eslint-disable-next-line no-underscore-dangle
      participantIdA: { urn: participantIdA.urn, typename: participantIdA.__typename },
      // eslint-disable-next-line no-underscore-dangle
      participantIdB: { urn: participantIdB.urn, typename: participantIdB.__typename },
      outcomeId,
      timePeriodId,
    };
  }

  // eslint-disable-next-line no-underscore-dangle
  if (obbTemplateParams.__typename === "ObbSquadBetParams") {
    const { outcomeIds, value, participantIds, timePeriodId, quantifier } = obbTemplateParams;

    return {
      participantIds: participantIds.map(({ urn, __typename }) => ({
        urn,
        typename: __typename,
      })),
      outcomeIds,
      value,
      timePeriodId,
      quantifier,
    };
  }

  // eslint-disable-next-line no-underscore-dangle
  if (obbTemplateParams.__typename === "ObbSquadVsSquadParams") {
    const { outcomeIds, squadAParticipantIds, squadBParticipantIds, timePeriodId, quantifier } = obbTemplateParams;

    return {
      squadAParticipantIds: squadAParticipantIds.map(({ urn, __typename }) => ({
        urn,
        typename: __typename,
      })),
      squadBParticipantIds: squadBParticipantIds.map(({ urn, __typename }) => ({
        urn,
        typename: __typename,
      })),
      outcomeIds,
      timePeriodId,
      quantifier,
    };
  }

  return null;
};

export default normalizeObbTemplateParamsFragmentIntoObbTemplateParams;
