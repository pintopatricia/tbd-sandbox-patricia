import URN from "../layout/URN";

/**
 * Runner data model type
 * holding data that is common between both Exchange and Sportsbook market runners
 */
export type Runner = {
  /** Runner URN */
  urn: URN;
  /** associated market URN */
  market: URN;
  /** associated selection id */
  selectionId: number;
  /** associated selection handicap value */
  handicap?: number;
};
