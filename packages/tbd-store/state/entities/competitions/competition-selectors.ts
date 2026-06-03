import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { Competition, Competitions } from "./Competition.types";

/**
 * For a given competition URN, returns the respective competition
 */
export const getCompetitionByURN = (competitions: Competitions, urn: URN | undefined): Competition | undefined =>
  urn ? competitions[urn] : undefined;

export const createCompetitionSelector = (): ParametricSelector<
  Competitions,
  URN | undefined,
  Competition | undefined
> => createSelector([getCompetitionByURN], (competition): Competition | undefined => competition);
