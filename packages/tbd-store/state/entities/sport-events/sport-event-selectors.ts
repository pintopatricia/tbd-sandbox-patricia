import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { SportEvent, SportEvents } from "./SportEvent.types";

/** ************************
 *  Sport Event selectors  *
 ************************* */

/**
 * For a given sport event URN, returns the corresponding event or undefined if there's none
 */
export const getSportEventByURN = (state: SportEvents, urn: URN): SportEvent | undefined => state[urn];

export const createSportEventByURNSelector = (): ParametricSelector<SportEvents, URN, SportEvent | undefined> =>
  createSelector([(sportEvents: SportEvents) => sportEvents, (_: SportEvents, urn: URN) => urn], getSportEventByURN);
