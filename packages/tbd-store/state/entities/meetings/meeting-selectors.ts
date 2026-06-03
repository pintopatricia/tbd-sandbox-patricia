import { createSelector } from "reselect";
import URN from "../../layout/URN";
import { Meeting, Meetings } from "./Meeting.types";

/**
 * For a given meeting URN, returns the corresponding meeting or undefined if there's none
 */
export const createMeetingByURNSelector = () =>
  createSelector(
    [(meetings: Meetings) => meetings, (_: Meetings, urn: URN) => urn],
    (meetings, urn): Meeting => meetings[urn],
  );
