import { ObbSquadbetQuotesQuery } from "../../clients/catalogue/catalogue-response-types";
import normalizeObbLegFragmentIntoObbLeg from "./normalizer/entities/obb-leg/obb-leg-normalizer";

export function buildObbSquadBetLegResult(result: ObbSquadbetQuotesQuery) {
  if (!result.obb || !result.obb.squadBetQuotes) {
    return {
      legs: [],
      defaultOutcomeIndex: 0,
    };
  }

  return {
    legs: result.obb.squadBetQuotes.legs.map((leg) => normalizeObbLegFragmentIntoObbLeg(leg)).map((leg) => leg.data),
    defaultOutcomeIndex: result.obb.squadBetQuotes.defaultOutcomeIndex,
  };
}
